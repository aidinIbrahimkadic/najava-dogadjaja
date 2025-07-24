import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Card, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, UserAddOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import CalendarSpinner from '../../ui/CalendarSpinner';
import { Link } from 'react-router-dom';
import { useRegister } from './useRegister';

const { Title, Text } = Typography;

const Container = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: linear-gradient(135deg, #fef7f0 0%, #fff7ed 50%, #fafafa 100%);
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  border: none;

  .ant-card-body {
    padding: 48px 32px;
  }
`;

const StyledTitle = styled(Title)`
  text-align: center;
  margin-bottom: 8px !important;
  color: #262626;
  font-weight: 700;
`;

const Subtitle = styled(Text)`
  display: block;
  text-align: center;
  color: #8c8c8c;
  margin-bottom: 32px;
  font-size: 15px;
`;

const StyledForm = styled.form`
  .form-item {
    margin-bottom: 24px;
  }

  .ant-input-affix-wrapper {
    border-radius: 8px;
    border: 1px solid #d9d9d9;
    padding: 12px 16px;

    &:hover {
      border-color: #f97316;
    }

    &:focus-within {
      border-color: #f97316;
      box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
    }

    .ant-input {
      border: none;
      box-shadow: none;
      padding: 0;
      font-size: 15px;

      &:focus {
        box-shadow: none;
      }
    }

    .anticon {
      color: #8c8c8c;
    }
  }
`;

const FormItem = styled.div`
  margin-bottom: 24px;
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #f97316, #ea580c);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #ea580c, #dc2626) !important;
    box-shadow: 0 6px 20px rgba(249, 115, 22, 0.4) !important;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;

  span {
    color: #8c8c8c;
    margin-right: 8px;
  }

  a {
    color: #f97316;
    font-weight: 600;
    text-decoration: none;

    &:hover {
      color: #ea580c;
      text-decoration: underline;
    }
  }
`;

const SpinnerContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 140px);
`;

export default function RegisterForm() {
  const { register, isPending } = useRegister();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      first_name: '',
      last_name: '',
      username: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Register:', data);
    register(data);
  };

  if (isPending) {
    return (
      <SpinnerContainer>
        <CalendarSpinner />
      </SpinnerContainer>
    );
  }

  return (
    <Container>
      <StyledCard>
        <StyledTitle level={2}>Kreirajte račun</StyledTitle>
        <Subtitle>Unesite svoje podatke za registraciju</Subtitle>

        <StyledForm onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <FormItem>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email je obavezan!',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email nije validan!',
                },
              }}
              render={({ field }) => (
                <>
                  <Input
                    autoFocus
                    {...field}
                    prefix={<MailOutlined />}
                    placeholder="Email*"
                    size="large"
                    status={errors.email ? 'error' : ''}
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </>
              )}
            />
          </FormItem>
          <FormItem>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Lozinka je obavezna!',
                minLength: {
                  value: 6,
                  message: 'Lozinka mora imati najmanje 6 znakova!',
                },
              }}
              render={({ field }) => (
                <>
                  <Input.Password
                    {...field}
                    autoComplete="new-password"
                    prefix={<LockOutlined />}
                    placeholder="Lozinka*"
                    size="large"
                    status={errors.password ? 'error' : ''}
                  />
                  {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
                </>
              )}
            />
          </FormItem>

          <FormItem>
            <Controller
              name="first_name"
              control={control}
              //   rules={{ required: 'Unesite ime!' }}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    prefix={<UserOutlined />}
                    placeholder="Ime"
                    size="large"
                    status={errors.first_name ? 'error' : ''}
                  />
                  {errors.first_name && <ErrorMessage>{errors.first_name.message}</ErrorMessage>}
                </>
              )}
            />
          </FormItem>

          <FormItem>
            <Controller
              name="last_name"
              control={control}
              //   rules={{ required: 'Unesite prezime!' }}
              render={({ field }) => (
                <>
                  <Input
                    {...field}
                    prefix={<UserOutlined />}
                    placeholder="Prezime"
                    size="large"
                    status={errors.last_name ? 'error' : ''}
                  />
                  {errors.last_name && <ErrorMessage>{errors.last_name.message}</ErrorMessage>}
                </>
              )}
            />
          </FormItem>
          <FormItem>
            <StyledButton
              type="primary"
              htmlType="submit"
              icon={<UserAddOutlined />}
              disabled={isPending}
            >
              {isPending ? 'Registracija...' : 'Registrujte se'}
            </StyledButton>
          </FormItem>
          <Controller
            name="roles"
            control={control}
            defaultValue={['Public']}
            render={({ field }) => <input type="hidden" {...field} />}
          />
        </StyledForm>

        <LoginLink>
          <span>Već imate račun?</span>
          <Link to="/login">Prijavite se</Link>
        </LoginLink>
      </StyledCard>
    </Container>
  );
}
