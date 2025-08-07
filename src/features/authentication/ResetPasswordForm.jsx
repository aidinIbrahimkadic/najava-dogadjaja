import { useForm, Controller } from 'react-hook-form';
import { Input, Button, Card, Typography, Spin } from 'antd';
import { MailOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import CalendarSpinner from '../../ui/CalendarSpinner';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { StyledPasswordInput } from '../../ui/StyledPasswordInput';
import { usePostResetPassword } from './usePostResetPassword';

const { Title, Text } = Typography;

const LoginContainer = styled.div`
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  background: linear-gradient(135deg, #fef7f0 0%, #fff7ed 50%, #fafafa 100%);
`;

const LoginCard = styled(Card)`
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

const ErrorMessage = styled.span`
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
`;

const FormItem = styled.div`
  margin-bottom: 24px;
`;

const LoginButton = styled(Button)`
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

const RegisterLink = styled.div`
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

export default function ResetPasswordForm() {
  const { postResetPassword, isCreating, isError } = usePostResetPassword();
  const [searchParams] = useSearchParams();

  const location = useLocation();

  useEffect(() => {
    if (location.state?.error) {
      toast.error(location.state.error);
      // Očistimo state da ne bi ostao pri refrešu
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
      token: '',
    },
  });

  const onSubmit = (data) => {
    const token = searchParams.get('token');

    postResetPassword({ data, token });
  };

  if (isCreating) {
    return (
      <SpinnerContainer>
        <CalendarSpinner />
      </SpinnerContainer>
    );
  }

  return (
    <LoginContainer>
      <LoginCard>
        <StyledTitle level={2}>Zaboravljena lozinka?</StyledTitle>
        <Subtitle>Unesite Vaš email i lozinku</Subtitle>

        <StyledForm onSubmit={handleSubmit(onSubmit)}>
          <FormItem>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Molimo unesite email adresu!',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Molimo unesite validnu email adresu!',
                },
              }}
              render={({ field }) => (
                <>
                  <Input
                    autoFocus={isError ? true : false}
                    {...field}
                    prefix={<MailOutlined />}
                    placeholder="Email adresa"
                    size="large"
                    status={errors.email ? 'error' : ''}
                  />
                  {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                </>
              )}
            />
          </FormItem>
          <FormItem label="Nova lozinka" required>
            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Molimo unesite novu lozinku!',
                minLength: {
                  value: 8,
                  message: 'Lozinka mora imati najmanje 8 znakova!',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                  message: 'Lozinka mora sadržavati velika slova, mala slova i brojeve!',
                },
              }}
              render={({ field }) => (
                <StyledPasswordInput
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Nova lozinka"
                  size="large"
                  status={errors.password ? 'error' : ''}
                />
              )}
            />
          </FormItem>
          <FormItem label="Ponovite novu lozinku" required>
            <Controller
              name="password_confirmation"
              control={control}
              rules={{
                required: 'Molimo ponovite lozinku!',
                validate: (value) => value === getValues('password') || 'Lozinke se ne podudaraju!',
              }}
              render={({ field }) => (
                <StyledPasswordInput
                  {...field}
                  prefix={<LockOutlined />}
                  placeholder="Ponovite lozinku"
                  size="large"
                  status={errors.password_confirmation ? 'error' : ''}
                  onPaste={(e) => e.preventDefault()}
                />
              )}
            />
          </FormItem>
          <FormItem>
            <LoginButton
              type="primary"
              htmlType="submit"
              icon={<LoginOutlined />}
              disabled={isCreating}
            >
              {isCreating ? 'Šaljemo email...' : 'Promijeni lozinku'}
            </LoginButton>
          </FormItem>
        </StyledForm>

        <RegisterLink>
          <span>Nemate račun?</span>
          <Link to="/register">Registrujte se</Link>
        </RegisterLink>
      </LoginCard>
    </LoginContainer>
  );
}

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom'; // Ako koristiš react-router-dom v6+
// import { usePostResetPassword } from './usePostResetPassword';

// function ResetPasswordForm() {
//   const [searchParams] = useSearchParams();
//   const [status, setStatus] = useState('loading'); // loading, success, error
//   const [message, setMessage] = useState('');

//   const { postResetPassword } = usePostResetPassword();

//   postResetPassword({ token });
//   if (status === 'loading') return <div>Verifikacija u toku...</div>;
//   if (status === 'error') return <div style={{ color: 'red' }}>{message}</div>;
//   return <div style={{ color: 'green' }}>{message}</div>;
// }

// export default ResetPasswordForm;
