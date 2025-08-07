import Modal from '../../ui/Modal';
import { HiOutlineUser } from 'react-icons/hi2';
import styled from 'styled-components';
import Spinner from '../../ui/Spinner';
import Button from '../../ui/Button';
import Checkbox from '../../ui/Checkbox';
import { useUserPermissions } from '../authentication/useUserPermissions';
import { useGetUser } from '../users/useUser';
import EditUserForm from './EditUserForm';
import EditUserPasswordForm from './EditUserPasswordForm';
import DeactivateUserForm from './DeactivateUserForm';

const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AccountHeader = styled.div``;

const AccountHeading = styled.h1`
  font-size: 3rem;
  font-weight: 200;
  line-height: 1.4;
`;

const InfoLabel = styled.p`
  font-size: 1.4rem;
`;

const InfoEmail = styled.p`
  font-size: 1.4rem;
  color: var(--color-grey-400);
`;

const EditBox = styled.div`
  display: grid;
  padding: 4rem 0;
  grid-template-columns: 1fr 1fr;

  & > div:first-child {
    border-right: 1px solid var(--color-grey-200);
  }
`;

const EditContainer = styled.div`
  padding: 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const EditHeading = styled.h2`
  color: var(--color-grey-400);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 1.6rem;
`;

const EditDataContainer = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;
const EditLabel = styled.p`
  color: var(--color-grey-500);
`;

const EditData = styled.p`
  color: var(--color-grey-700);
  font-weight: 600;
`;

const PasswordDots = styled.p`
  -webkit-text-security: disc;
  letter-spacing: 0.2rem;
  font-size: 1.6rem;
`;

const AccountHeaderContainer = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  border-bottom: 1px solid var(--color-grey-200);
  padding-bottom: 1rem;
`;

export default function UserProfilePage() {
  const { user: userPermission, isLoading: isLoadingPermission } = useUserPermissions();
  const { user, isLoading } = useGetUser(userPermission?.idguid || '');

  if (isLoading || isLoadingPermission) return <Spinner />;

  return (
    <AccountContainer>
      <AccountHeaderContainer>
        <HiOutlineUser size={70} />
        <AccountHeader>
          <AccountHeading as="h4">Zdravo {user.data.first_name}</AccountHeading>
          <InfoLabel>Ovdje možeš upravljati svojim podacima</InfoLabel>
          <InfoEmail>{user.data.email}</InfoEmail>
        </AccountHeader>
      </AccountHeaderContainer>
      <EditBox>
        <EditContainer>
          <EditHeading>Informacije o korisničkom računu</EditHeading>

          <EditDataContainer>
            <div>
              <EditLabel>Username</EditLabel>
              <EditData>{user.data.username}</EditData>
            </div>

            <div>
              <EditLabel>Ime</EditLabel>
              <EditData>{user.data.first_name}</EditData>
            </div>
            <div>
              <EditLabel>Prezime</EditLabel>
              <EditData>{user.data.last_name}</EditData>
            </div>
            <div>
              <EditLabel>Korisnik aktivan</EditLabel>
              <Checkbox checked={user.data.active} readOnly />
            </div>
          </EditDataContainer>
          <div>
            <Modal>
              <Modal.Open opens="Uredi profil">
                <Button size="small" variation="link">
                  Uredi Profil
                </Button>
              </Modal.Open>
              <Modal.Window size="medium" name="Uredi profil">
                <EditUserForm userToEdit={user} />
              </Modal.Window>
            </Modal>
          </div>
        </EditContainer>
        <EditContainer>
          <EditHeading>Privatne informacije</EditHeading>

          <EditDataContainer>
            <div>
              <EditLabel>Email</EditLabel>
              <EditData>{user.data.email}</EditData>
            </div>
            <div>
              <EditLabel>Lozinka</EditLabel>
              <PasswordDots>Neki password</PasswordDots>
            </div>
          </EditDataContainer>
          <div>
            <Modal>
              <Modal.Open opens="Promijeni lozinku">
                <Button size="small" variation="link">
                  Promijeni lozinku
                </Button>
              </Modal.Open>
              <Modal.Window size="medium" name="Promijeni lozinku">
                <EditUserPasswordForm />
              </Modal.Window>
            </Modal>
          </div>
          <div>
            <Modal>
              <Modal.Open opens="Deaktiviraj profil">
                <Button size="small" variation="link">
                  Deaktiviraj profil
                </Button>
              </Modal.Open>
              <Modal.Window size="medium" name="Deaktiviraj profil">
                <DeactivateUserForm userToEdit={user} />
              </Modal.Window>
            </Modal>
          </div>
        </EditContainer>
      </EditBox>
    </AccountContainer>
  );
}
