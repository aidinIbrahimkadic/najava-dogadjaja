import { ICON_OPTIONS } from './icons'; // ili definiraj lokalno

export function IconSelector({ register, name, defaultValue }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {ICON_OPTIONS.map((opt) => {
        const Icon = opt.icon;
        return (
          <label
            key={opt.value}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              border: defaultValue === opt.value ? '2px solid #007bff' : '1px solid #ccc',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              width: '8rem',
            }}
          >
            <input
              type="radio"
              value={opt.value}
              {...register(name)}
              defaultChecked={defaultValue === opt.value}
              style={{ marginBottom: '0.5rem' }}
            />
            <Icon size={24} />
            {/* <small>{opt.label}</small> */}
          </label>
        );
      })}
    </div>
  );
}
