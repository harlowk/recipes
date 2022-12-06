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
import Create from "./Containers/Create"
import reducers from "./reducers"

const store = createStore(reducers, applyMiddleware(thunkMiddleware))

const WrappedHome = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/search/:id" component={Home} />
        <Route exact path="/recipe/:name" component={Home} />
        <Route exact path="/create" component={Create} />
      </Switch>
    </Router>
  </Provider>
)

const HotHome = hot(module)(WrappedHome)

ReactDOM.render(<HotHome />, document.getElementById("home"))
