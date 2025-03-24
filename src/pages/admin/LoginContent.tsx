import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../../shared/api/createRequest";
import { useAuth } from "../../context/AuthContext";

export const LoginContent = (props: any) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const {backendServer} = props;

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');

    const handleOnClick = (e: any) => {
        e.preventDefault();

        createRequest({
            url: backendServer + `/api/login`,
            sendMethod: 'POST',
            data: {
                email: email,
                password: pwd,
            },
            callback: (response: any) => {
                if (response.user) {
                    login(response.user, response.token);
                    window.location.href = '/admin/index';
                } else {
                    alert('Invalid credentials');
                }
            }
        });
    };

    return (
        <main>
            <section className="login">
            <header className="login__header">
                <h2 className="login__title">Авторизация</h2>
            </header>
            <div className="login__wrapper">
                <label className="login__label">
                    E-mail
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@domain.xyz"
                        className="login__input"
                        name="email"
                        required
                    />
                </label>
                <label className="login__label">
                    Пароль
                    <input
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        placeholder=""
                        className="login__input"
                        name="password"
                        required
                    />
                </label>
                <div className="text-center">
                    <input value="Авторизоваться" type="submit" className="login__button" onClick={handleOnClick}/>
                </div>
            </div>
            </section>
        </main>
    )
}
