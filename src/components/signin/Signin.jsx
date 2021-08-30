import userEvent from "@testing-library/user-event";
import React,{useState} from "react";

const Signin = ({onRouteChange, loadUser}) =>{

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onEmailChange = (e) =>{
        setEmail(e.target.value);
    }

    const onPasswordChange = (e) =>{
        setPassword(e.target.value);
    }

    const onSubmitSignin = async () =>{
        var response = await fetch('https://pure-bayou-89320.herokuapp.com/', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: email,
                password: password
            }) 
        })
        var user = await response.json();
        if(user.id){
            loadUser(user);
            onRouteChange('home')
        }
    }

    return(
        <article className="br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
            <main className="pa4 black-80">
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                    <legend className="f1 fw6 ph0 mh0">Sign In</legend>
                    <div className="mt3">
                        <label className="db fw6 lh-copy f6" HtmlFor="email-address">Email</label>
                        <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="email" 
                            name="email-address"  
                            id="email-address"
                            onChange={onEmailChange}
                            />
                    </div>
                    <div className="mv3">
                        <label className="db fw6 lh-copy f6" HtmlFor="password">Password</label>
                        <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
                            type="password" 
                            name="password"  
                            id="password"
                            onChange={onPasswordChange}
                        />
                    </div>
                    </fieldset>
                    <div className="">
                    <input className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
                        type="submit" 
                        value="Sign in" 
                        onClick={onSubmitSignin} 
                    />
                    </div>
                    <div className="lh-copy mt3 pointer">
                        <a onClick={()=> onRouteChange('register')} className="f6 link dim black db">Register</a>
                    </div>
                </div>
            </main>
        </article>
    )
}

export default Signin