export interface FormValidationResult {
    isValid: boolean;
    errorMessage: string;
}

export const validateRole = (selectedRole: string): FormValidationResult => {
    if (selectedRole === '') {
        return {
            isValid: false,
            errorMessage: 'Select a role to register',
        };
    }

    return { isValid: true, errorMessage: '' };
};

export const validateName = (firstName: string, lastName: string): FormValidationResult => {
    if (!firstName.trim() || !lastName.trim()) {
        return {
            isValid: false,
            errorMessage: 'Enter valid name',
        };
    }

    return { isValid: true, errorMessage: '' };
};

export const validateAddress = (address: string): FormValidationResult => {
    if (!address.trim()) {
        return {
            isValid: false,
            errorMessage: 'Enter valid address',
        };
    }

    return { isValid: true, errorMessage: '' };
};

export const validatePasswordMatch = (password: string, confirmPassword: string): FormValidationResult => {
    if (password !== confirmPassword) {
        return {
            isValid: false,
            errorMessage: 'Passwords do not match!',
        };

    }
    return { isValid: true, errorMessage: '' };

};


export const validateVehicleNumber = (vehicleNumber: string): FormValidationResult => {
    if (!vehicleNumber.trim()) {
        return {
            isValid: false,
            errorMessage: 'Enter valid vehicle number'
        }
    }
    return { isValid: true, errorMessage: '' };
}