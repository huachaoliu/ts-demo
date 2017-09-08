import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as PropTypes from 'prop-types';

// const style = require('style.css');

export interface ILoginFrom {
    email?: string;
    password?: string;
}

export class Login extends React.Component<ILoginFrom, any> {

    static propTypes = {
        email: PropTypes.string,
        password: PropTypes.string
    }

    constructor(props) {
        super(props);
    }

    public render() {
        return (
            <div className="login">
                <form action="">
                    <label htmlFor="">
                        <input placeholder="请输入用户名" />
                    </label>
                    <label htmlFor="">
                        <input type="password" placeholder="请输入密码" />
                    </label>
                </form>
            </div>
        )
    }
}

ReactDOM.render(
    <Login />,
    document.getElementById('root')
);