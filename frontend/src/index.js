import * as React from "react"
import * as ReactDOM from "react-dom"
import { hot } from "react-hot-loader"
import { Provider } from "react-redux"
import {
  BrowserRouter as Router,
  Route, Switch
} from "react-router-dom"
import { applyMiddleware, createStore } from "redux"
import thunkMiddleware from "redux-thunk"
import Home from "./Containers/Home"
import reducers from "./reducers"

const store = createStore(reducers, applyMiddleware(thunkMiddleware))

const WrappedHome = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/search/:id" component={Home} />
        <Route path="/recipe/:name" component={Home} />
      </Switch>
    </Router>
  </Provider>
)

const HotHome = hot(module)(WrappedHome)

ReactDOM.render(<HotHome />, document.getElementById("home"))
