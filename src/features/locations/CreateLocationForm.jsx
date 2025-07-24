// import { useForm } from 'react-hook-form';

// import Input from '../../ui/Input';
// import Form from '../../ui/Form';
// import Button from '../../ui/Button';
// import TextArea from '../../ui/TextArea';
// import FormRow from '../../ui/FormRow';
// import FormField from '../../ui/FormField';

// import { usePostLocation } from './usePostLocation';
// import { useUpdateLocation } from './useUpdateLocation';

// // POPRAVITI MAPA POKUSAJ MANUALNO
// // import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// function CreateLocationForm({ locationToEdit = {}, onCloseModal }) {
//   const { isCreating, postLocation } = usePostLocation();
//   const { isEditing, updateLocation } = useUpdateLocation();
//   const isWorking = isCreating || isEditing;

//   const { idguid: editId, ...editValues } = locationToEdit;
//   const isEditSession = Boolean(editId);

//   const { register, handleSubmit, reset, formState } = useForm({
//     defaultValues: isEditSession ? editValues : {},
//   });
//   const { errors } = formState;

//   function onSubmit(data) {
//     if (isEditSession)
//       updateLocation(
//         { data, editId },
//         {
//           onSuccess: () => {
//             reset();
//             onCloseModal?.();
//           },
//         }
//       );
//     else
//       postLocation(
//         { ...data },
//         {
//           onSuccess: () => {
//             reset();
//             onCloseModal?.();
//           },
//         }
//       );
//   }

//   function onError() {
//     // console.log(errors);
//   }

//   return (
//     <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
//       <FormRow columns="1fr 1fr">
//         <FormField label="Naziv lokacije" error={errors?.naziv?.message} required>
//           <Input
//             autoFocus
//             type="text"
//             id="naziv"
//             disabled={isWorking}
//             {...register('naziv', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//         <FormField label="Adresa" error={errors?.adresa?.message} required>
//           <Input
//             type="text"
//             id="adresa"
//             disabled={isWorking}
//             {...register('adresa', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//       </FormRow>
//       <FormRow></FormRow>
//       <FormRow columns="1fr 1fr">
//         <FormField label="Longitude" error={errors?.longitude?.message} required>
//           <Input
//             type="text"
//             id="longitude"
//             disabled
//             {...register('longitude', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//         <FormField label="Latitude" error={errors?.latitude?.message} required>
//           <Input
//             type="text"
//             id="latitude"
//             disabled
//             {...register('latitude', {
//               required: 'Ovo polje je obavezno',
//             })}
//           />
//         </FormField>
//       </FormRow>
//       <FormRow>
//         <FormField label="Opis lokacije" error={errors?.opis?.message}>
//           <TextArea
//             type="text"
//             id="opis"
//             defaultValue=""
//             disabled={isWorking}
//             {...register('opis')}
//           />
//         </FormField>
//       </FormRow>
//       <FormRow>
//         <FormField label="Mjesto" error={errors?.mjesto?.message}>
//           <Input type="text" id="mjesto" disabled={isWorking} {...register('mjesto')} />
//         </FormField>
//       </FormRow>
//       <FormRow>
//         <Button
//           title="Odustani"
//           variation="secondary"
//           type="reset"
//           size="small"
//           onClick={() => onCloseModal?.()}
//         >
//           Odustani
//         </Button>
//         <Button
//           title={isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
//           size="small"
//           variation="primary"
//           disabled={isWorking}
//         >
//           {isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
//         </Button>
//       </FormRow>
//     </Form>
//   );
// }

// export default CreateLocationForm;

// VERZIJA 2
import { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import TextArea from '../../ui/TextArea';
import FormRow from '../../ui/FormRow';
import FormField from '../../ui/FormField';

import { usePostLocation } from './usePostLocation';
import { useUpdateLocation } from './useUpdateLocation';

// === Autocomplete for address ===
const SuggestionsBox = styled.ul`
  position: absolute;
  z-index: 10;
  background: #fff;
  border: 1px solid #eee;
  width: 100%;
  max-height: 180px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  list-style: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
`;

const Suggestion = styled.li`
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background: #f2f2f2;
  }
`;

function AddressAutocomplete({ value, onChange, setGeoData, disabled, error }) {
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef();
  const containerRef = useRef();

  // Općina Tešanj bounding box (approx). You may refine these coordinates.
  const TESANJ_BBOX = '17.958,44.547,18.203,44.687';

  const handleInputChange = (e) => {
    const val = e.target.value;
    onChange(val);
    setShow(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!val || val.length < 2) {
      setSuggestions([]);
      return;
    }
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        // Nominatim, ograničeno na BiH, Tešanj bbox
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=ba&limit=8&q=${encodeURIComponent(
          val + ' Tešanj'
        )}&viewbox=${TESANJ_BBOX}&bounded=1`;
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(
          data.map((item) => ({
            display_name: item.display_name,
            lat: item.lat,
            lon: item.lon,
            address: item.address,
          }))
        );
      } catch {
        setSuggestions([]);
      }
      setLoading(false);
    }, 350); // debounce
  };

  const handleSuggestionClick = (s) => {
    setShow(false);
    onChange(s.display_name);
    setGeoData({
      latitude: parseFloat(s.lat),
      longitude: parseFloat(s.lon),
      adresa: s.display_name,
      mjesto: s.address?.city || s.address?.town || s.address?.village || '',
    });
  };

  // Hide suggestions when clicking outside
  const handleBlur = (e) => {
    console.log(e);
    setTimeout(() => setShow(false), 120);
  };

  return (
    <div style={{ position: 'relative' }} ref={containerRef}>
      <Input
        type="text"
        value={value || ''}
        disabled={disabled}
        autoComplete="off"
        placeholder="Unesi adresu (npr. Medakovo bb)"
        onChange={handleInputChange}
        onFocus={() => setShow(true)}
        onBlur={handleBlur}
        id="adresa"
        error={error}
      />
      {show && suggestions.length > 0 && (
        <SuggestionsBox>
          {suggestions.map((s, i) => (
            <Suggestion key={i} onMouseDown={() => handleSuggestionClick(s)}>
              {s.display_name}
            </Suggestion>
          ))}
        </SuggestionsBox>
      )}
      {show && !loading && suggestions.length === 0 && value && value.length > 2 && (
        <SuggestionsBox>
          <Suggestion>Nema rezultata</Suggestion>
        </SuggestionsBox>
      )}
      {show && loading && (
        <SuggestionsBox>
          <Suggestion>Pretraživanje...</Suggestion>
        </SuggestionsBox>
      )}
    </div>
  );
}

// === Map picker ===
function LocationMarker({ lat, lng, onChange }) {
  const [position, setPosition] = useState(lat && lng ? [lat, lng] : null);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return position === null ? null : (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })}
    />
  );
}

function LocationMapPicker({ latitude, longitude, onChange }) {
  const center = latitude && longitude ? [latitude, longitude] : [44.6305, 18.0115]; // Tešanj center
  return (
    <div
      style={{
        height: 250,
        width: '100%',
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid #eaeaea',
      }}
    >
      <MapContainer center={center} zoom={13} style={{ height: 250, width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker lat={latitude} lng={longitude} onChange={onChange} />
      </MapContainer>
    </div>
  );
}

// === MAIN FORM ===
function CreateLocationForm({ locationToEdit = {}, onCloseModal }) {
  const { isCreating, postLocation } = usePostLocation();
  const { isEditing, updateLocation } = useUpdateLocation();
  const isWorking = isCreating || isEditing;

  const { idguid: editId, ...editValues } = locationToEdit;
  const isEditSession = Boolean(editId);

  // Default values, popuni polja ili prazno
  const { register, handleSubmit, reset, control, setValue, watch, formState } = useForm({
    defaultValues: isEditSession
      ? editValues
      : {
          naziv: '',
          opis: '',
          adresa: '',
          latitude: '',
          longitude: '',
          mjesto: '',
        },
  });
  const { errors } = formState;

  // Sync: kada odaberemo adresu ili kliknemo na mapu
  const setGeoData = ({ latitude, longitude, adresa, mjesto }) => {
    setValue('latitude', latitude);
    setValue('longitude', longitude);
    if (adresa) setValue('adresa', adresa);
    if (mjesto !== undefined) setValue('mjesto', mjesto);
  };

  // Sync: klik na mapu
  const handleMapPosition = ({ lat, lng }) => {
    setGeoData({ latitude: lat, longitude: lng });
  };

  function onSubmit(data) {
    if (isEditSession)
      updateLocation(
        { data, editId },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
    else
      postLocation(
        { ...data },
        {
          onSuccess: () => {
            reset();
            onCloseModal?.();
          },
        }
      );
  }

  function onError() {
    // console.log(errors);
  }

  // Watch for lat/lng so map and inputs are always in sync
  const latitude = Number(watch('latitude'));
  const longitude = Number(watch('longitude'));

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow>
        <FormField label="Adresa" error={errors?.adresa?.message} required>
          <Controller
            name="adresa"
            control={control}
            rules={{ required: 'Ovo polje je obavezno' }}
            render={({ field }) => (
              <AddressAutocomplete
                value={field.value}
                onChange={field.onChange}
                setGeoData={setGeoData}
                disabled={isWorking}
                error={errors?.adresa?.message}
              />
            )}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <LocationMapPicker latitude={latitude} longitude={longitude} onChange={handleMapPosition} />
      </FormRow>

      <FormRow>
        <FormField label="Latitude">
          <Input
            type="number"
            id="latitude"
            value={latitude || ''}
            disabled
            {...register('latitude')}
          />
        </FormField>
        <FormField label="Longitude">
          <Input
            type="number"
            id="longitude"
            value={longitude || ''}
            disabled
            {...register('longitude')}
          />
        </FormField>
      </FormRow>

      <FormRow>
        <FormField label="Naziv lokacije" error={errors?.naziv?.message} required>
          <Input
            autoFocus
            type="text"
            id="naziv"
            disabled={isWorking}
            {...register('naziv', {
              required: 'Ovo polje je obavezno',
            })}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Opis lokacije" error={errors?.opis?.message}>
          <TextArea
            type="text"
            id="opis"
            defaultValue=""
            disabled={isWorking}
            {...register('opis')}
          />
        </FormField>
      </FormRow>
      <FormRow>
        <FormField label="Mjesto" error={errors?.mjesto?.message}>
          <Input type="text" id="mjesto" disabled={isWorking} {...register('mjesto')} />
        </FormField>
      </FormRow>

      <FormRow>
        <Button
          title="Odustani"
          variation="secondary"
          type="reset"
          size="small"
          onClick={() => onCloseModal?.()}
        >
          Odustani
        </Button>
        <Button
          title={isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
          size="small"
          variation="primary"
          disabled={isWorking}
        >
          {isEditSession ? 'Uredi lokaciju' : 'Dodaj novu lokaciju'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateLocationForm;
