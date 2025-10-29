import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../store';

interface LoginPageProps {
  onRegisterLinkClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onRegisterLinkClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAppContext();
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('error.allFieldsRequired'));
      return;
    }
    const success = login(email, password);
    if (success) {
      setError('');
    } else {
      setError(t('error.invalidCredentials'));
    }
  };

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">{t('auth.signInTitle')}</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input id="email-address" name="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder={t('auth.emailPlaceholder')} />
            </div>
            <div>
              <input id="password" name="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" placeholder={t('auth.passwordPlaceholder')} />
            </div>
          </div>
          <div>
            <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              {t('auth.signInButton')}
            </button>
          </div>
        </form>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {t('auth.or')}{' '}
          <button onClick={onRegisterLinkClick} className="font-medium text-blue-600 hover:text-blue-500">
            {t('auth.createAccountLink')}
          </button>
        </p>
      </div>
    </div>
  );
};

interface RegisterPageProps {
    onLoginLinkClick: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onLoginLinkClick }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', patronymic: '', email: '', password: '', birthDate: '' });
    const [error, setError] = useState('');
    const { register } = useAppContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { firstName, lastName, email, password, birthDate } = formData;
        if (!firstName || !lastName || !email || !password || !birthDate) {
            setError(t('error.fillRequiredFields'));
            return;
        }
        if (password.length < 3) {
            setError(t('error.passwordLength'));
            return;
        }

        const success = register({
            firstName,
            lastName,
            patronymic: formData.patronymic,
            email,
            password,
            birthDate
        });

        if (success) {
            setError('');
            alert(t('alert.registrationSuccess'));
            onLoginLinkClick();
        } else {
            setError(t('error.emailExists'));
        }
    };
    
    const inputFieldClass = "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white";

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">{t('auth.createAccountTitle')}</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <input name="firstName" value={formData.firstName} onChange={handleChange} required className={inputFieldClass} placeholder={t('auth.firstNamePlaceholder')} />
                    <input name="lastName" value={formData.lastName} onChange={handleChange} required className={inputFieldClass} placeholder={t('auth.lastNamePlaceholder')} />
                    <input name="patronymic" value={formData.patronymic} onChange={handleChange} className={inputFieldClass} placeholder={t('auth.patronymicPlaceholder')} />
                    <input name="email" type="email" value={formData.email} onChange={handleChange} required className={inputFieldClass} placeholder={t('auth.emailPlaceholder')} />
                    <input name="password" type="password" value={formData.password} onChange={handleChange} required className={inputFieldClass} placeholder={t('auth.passwordPlaceholder')} />
                    <input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange} required className={inputFieldClass} placeholder={t('auth.birthDatePlaceholder')} />
                    
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            {t('auth.registerButton')}
                        </button>
                    </div>
                </form>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {t('auth.alreadyHaveAccount')}{' '}
                    <button onClick={onLoginLinkClick} className="font-medium text-blue-600 hover:text-blue-500">
                        {t('auth.signInLink')}
                    </button>
                </p>
            </div>
        </div>
    );
};
