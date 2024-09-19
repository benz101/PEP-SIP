export const FMSuccess = (result) => {
    return {
        type: 'FM_SUCCESS',
        valueFM: result
    }
}

export const FMError = (result) => {
    return {
        type: 'FM_ERROR',
        valueError: result
    }
}