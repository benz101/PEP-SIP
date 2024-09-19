export const SPVSuccess = (result) => {
    return {
        type: 'SPV_SUCCESS',
        valueSPV: result
    }
}

export const SPVError = (result) => {
    return {
        type: 'SPV_ERROR',
        valueError: result
    }
}