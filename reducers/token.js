import {GET_TOKEN, SAVE_TOKEN_SUCCESS} from "../actions/types";

const initialState = {
    token: []
};

export default function token(state = initialState, action) {
    const {type, payload} = action;
    switch (type) {
        case SAVE_TOKEN_SUCCESS:
            return {...state, token: payload};
        case GET_TOKEN:
            return {...state, token: action.payload};
        default:
            return state
    }
}
