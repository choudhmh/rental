const Validation = (values) =>{
    
    let error = {}
    const email_pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;;
    const password_pattern = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;

    if(values.name === ''){
        error.name = 'Name should not be empty';
    }
    // else if(!name_pattern.test(values.email)){
    //     error.name = 'Name Didn/t match';
    // }
    else{
        error.name=''
    }

    if(values.email === ''){
        error.email = 'Name should not be empty';
    }
    // else if(!email_pattern.test(values.email)){
    //     error.email = 'Email Didn/t match';
    // }
    else{
        error.email=''
    }


    if(values.password === ''){
        error.password = 'Password should not be empty';
    }
    // else if(!password_pattern.test(values.email)){
    //     error.password = 'Password Didn/t match';
    // }
    else{
        error.password=''
    }

    return error;
}

export default Validation