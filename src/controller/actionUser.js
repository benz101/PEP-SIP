export const userSuccess = (result) => {
    return {
        type: 'USER_SUCCESS',
        valueUser: result
    }
}

export const loginError = (result) => {
    return {
        type: 'USER_ERROR',
        valueError: result
    }
}