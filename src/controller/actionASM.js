export const ASMSuccess = (result) => {
    return {
        type: 'ASM_SUCCESS',
        valueASM: result
    }
}

export const ASMError = (result) => {
    return {
        type: 'ASM_ERROR',
        valueError: result
    }
}