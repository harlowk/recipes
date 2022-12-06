import { combineReducers } from "redux"
import search from "./search"
import recipe from './recipe'
import create from './create'

export default combineReducers({
    search,
    recipe,
    create
})
