import '../index.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from './auth';

const REST_API_URL = "http://localhost:8080/";

export function GetUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        fetch(REST_API_URL + "users/all")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(responce => {
                setUsers(responce);
            })
            .catch((err) => {
                console.error('Fetch error:', err);
                setError(err);
                setUsers([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Загрузка пользователей…</div>;
    if (error) return <div>Ошибка: {error.message}</div>;
    else {
        return users;
    }
}

export function LoginUser() {
    const { setUsername, setId } = useAuth();

    const navigate = useNavigate();

    // Состояния для ввода пользователя и пароля
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    // Состояния для результата логина
    const [loginResult, setLoginResult] = useState(null); // Сохраняем результат логина
    const [loading, setLoading] = useState(false); // Загрузка только во время запроса
    const [error, setError] = useState(null);

    // Обработчик для изменения поля username
    const handleUsernameChange = (event) => {
        setLogin(event.target.value);
    };

    // Обработчик для изменения поля password
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    // Функция для выполнения запроса логина, вызывается по клику на кнопку
    const performLogin = () => {
        setLoading(true);
        setError(null);
        setLoginResult(null); // Очистить предыдущий результат логина

        // Важно: Проверяем, что username и password не пустые перед отправкой
        if (!login || !password) {
            setError(new Error("Username and password cannot be empty."));
            setLoading(false);
            return;
        }

        fetch(REST_API_URL + "users/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({ username: login, password: password })
            // body: new URLSearchParams({ username: username, password: password }).toString()
        })
        .then(responce => {
            if (!responce.ok) {
                return responce.text().then(text => {
                    throw new Error(`HTTP error! status: ${responce.status}, message: ${text}`);
                });
            }
            return responce.json();
        })
        .then(data => {
            console.log("Login successful:", data);
            console.log(data.username, data.id);
            setUsername(data.username);
            setId(data.id);

            navigate("/");
        })
        .catch((err) => {
            console.error('Fetch error:', err);
            setError(err);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        // Этот блок JSX будет отображаться, когда isLoginModalOpen === true
        <div className="container_login">
            <div className="container_login_block">
                <p className="font24"> Login </p>
                <input
                    className="login_block_input font18"
                    placeholder='username'
                    value={login}
                    onChange={handleUsernameChange}
                    // Лучше убрать ID, если вы управляете через React состояние
                    // id='username'
                />
            </div>
            <div className="container_login_block">
               <p className="font24"> Password </p>
                <input
                    className="login_block_input font18"
                    placeholder='password'
                    type='password'
                    value={password}
                    onChange={handlePasswordChange}
                    // Лучше убрать ID
                    // id='password'
                />
            </div>
            <button className="login_block_button font24" onClick={performLogin} disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>

            {loading && <div>Loading...</div>}
            {error && <div style={{color: 'red'}}>Error: {error.message}</div>}
            {loginResult && <div>Login successful!</div>} {/* Отображаем сообщение об успехе */}
        </div>
    );
}