import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import axios from 'axios';

import * as actions from '../actions/index';

export function* logoutSaga (action) {
    yield localStorage.removeItem('token');
    yield localStorage.removeItem('expitarionDate');
    yield localStorage.removeItem('userId');
    yield put(actions.logoutSucceed());
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000);
    yield put(actions.logout());
}

export function* authUserSaga(action) {
    yield put(actions.authStart());
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    };
    let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyCX3HGTc9yGalpCh4aENeclHR3NQOgu9W0';
    if(!action.isSignup) {
        url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyCX3HGTc9yGalpCh4aENeclHR3NQOgu9W0';
    }

    try {
    const response = yield axios.post(url, authData)
        
    const expirationDate = yield new Date(new Date().getTime() + response.data.expiresIn * 1000);
    yield localStorage.setItem('token', response.data.idToken);
    yield localStorage.setItem('expirationDate', expirationDate);
    yield localStorage.setItem('userId', response.data.localId);
    yield put(actions.authSuccess(response.data.idToken, response.data.localId));
    yield put(actions.checkAuthTimeout(response.data.expiresIn));
    }  catch (error) {
        yield put (actions.authFail(error.response.data.error));
    }
}