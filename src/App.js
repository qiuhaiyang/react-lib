import React, {lazy, Suspense} from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import Loading from './components/Loading'
const Login = lazy(() => import('./pages/RL/Login'))
const Register = lazy(() => import('./pages/RL/Register'))
const Forget = lazy(() => import('./pages/RL/Forget'))
const HomePage = lazy(() => import("./pages/HomePage"))
export default function App() {
    return (
        <Suspense fallback={<Loading/>}>
            <Switch>
                <Route path='/home' component={HomePage}></Route>
                <Route path='/rl/login' component={Login} ></Route>
                <Route path='/rl/register' component={Register}></Route>
                <Route path='/rl/forget' component={Forget}></Route>
                <Redirect to='/home' />
            </Switch>
        </Suspense>
    )
}
