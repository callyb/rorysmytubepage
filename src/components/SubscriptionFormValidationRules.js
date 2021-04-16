export default function validate(values) {
    let errors = {};
    if (!values.email) {
        errors.email = 'We need your email address!'
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = 'This is not a real email (format is wrong)';
    }
    return errors;
};