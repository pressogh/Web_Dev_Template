import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_action/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [Name, setName] = useState("")
    const [Email, setEmail] = useState("");
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        //버튼 누를때마다 refresh방지
        event.preventDefault();

        if (Password !== ConfirmPassword) {
            return alert('비밀번호를 확인해 주십시오.');
        }

        let body = {
            name: Name,
            email: Email,
            password: Password
            
        }
        
        dispatch(registerUser(body))
        .then(response => {
            if (response.payload.registerSuccess) {
                props.history.push("/login");
            } else {
                alert("회원가입에 실패하였습니다.");
            }
        })
    }

    return (
        <div style={{
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100vh'
        }}>
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={onSubmitHandler}>

                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <br />

                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <br />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                <br />

                <button>
                    회원가입
                </button>

            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
