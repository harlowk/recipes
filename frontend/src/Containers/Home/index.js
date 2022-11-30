import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import Divider from "@material-ui/core/Divider"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Input from "@material-ui/core/Input"
import LinearProgress from "@material-ui/core/LinearProgress"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import React, { Component } from "react"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import * as actions from "../../actions"
import RecipeInspector from "../Recipe"
import { HomeWrapper } from "./styles"

const ingredientList = ["flour", "sugar", "salt", "butter", "milk"]

class Home extends Component {
  constructor(props) {
    super(props)
    this.handleSearch = this.handleSearch.bind(this)
    this.handleIngredient = this.handleIngredient.bind(this)
    this.handleRecipeClick = this.handleRecipeClick.bind(this)
    this.fetchSearch = this.fetchSearch.bind(this)
    this.encodeState = this.encodeState.bind(this);
    this.decodeState = this.decodeState.bind(this);
    this.state = {
      term: "",
      ingredients: ["milk"]
    }
  }

  encodeState (recipeId) {
    const encoded = Buffer.from(JSON.stringify({ ...this.state, recipeId: recipeId })).toString('base64');
    window.history.replaceState({}, "", `/search/${encoded}`)
  }

  decodeState () {
    try {
      const parts = window.location.pathname.split('/');
      if (parts[1] === 'search') {
        const decoded = Buffer.from(parts[2], 'base64').toString('ascii');
        const { term, ingredients, recipeId } = JSON.parse(decoded);
        this.setState({ term: term ?? "", ingredients: ingredients ?? ["milk"] });
        this.props.searchRecipes(term, ingredients)
        if (recipeId) {
          this.props.fetchRecipe(recipeId);
        }
      } else if (parts[1] === 'recipe') {
        this.props.fetchRecipe(parts[2]);
      }
    } catch {
      // do nothing  (logging would be nice))
      console.log('error decoding state');
    }
  }

  fetchSearch () {
    const { term, ingredients } = this.state
    this.props.searchRecipes(term, ingredients)
    this.encodeState();
  }

  handleSearch (event) {
    const term = event.target.value
    this.setState({ term })
    this.encodeState();
  }

  handleRecipeClick (recipe) {
    this.props.fetchRecipe(recipe.id)
    this.encodeState(recipe.id);
  }

  handleIngredient (ingredient, event) {
    const { ingredients } = { ...this.state }
    if (event.target.checked) {
      ingredients.push(ingredient)
    } else {
      const foundIngredient = ingredients.indexOf(ingredient)
      ingredients.splice(foundIngredient, 1)
    }
    this.setState({ ingredients })
    this.encodeState();
  }

  componentDidMount () {
    this.decodeState();
  }

  render () {
    const { term, ingredients } = this.state
    const { recipes, recipe, isLoading } = this.props

    return (
      <HomeWrapper>
        <Input
          autoFocus={true}
          fullWidth={true}
          onChange={this.handleSearch}
          value={term}
        />
        <div>
          <h3>Ingredients on hand</h3>
          {ingredientList.map((ingredient) => (
            <FormControlLabel
              key={ingredient}
              control={
                <Checkbox
                  checked={ingredients.includes(ingredient)}
                  onChange={this.handleIngredient.bind(this, ingredient)}
                  value={ingredient}
                />
              }
              label={ingredient}
            />
          ))}
        </div>
        <Button onClick={this.fetchSearch}>search</Button>
        <Divider />
        {recipes && (
          <div className="overflow-container">
            <List>
              {recipes.map((rp) => (
                <ListItem key={rp.id} button onClick={this.handleRecipeClick.bind(this, rp)}>
                  <ListItemText primary={rp.name} className={rp.name === recipe?.name ? "recipe-selected" : "recipe-not-selected"} />
                </ListItem>
              ))}
            </List>
          </div>
        )}
        {isLoading && <LinearProgress />}
        <Divider />
        {/*
          TODO: Add a recipe component here.
          I'm expecting you to have it return null or a component based on the redux state, not passing any props from here
          I want to see how you wire up a component with connect and build actions.
        */}
        {recipe && <RecipeInspector />}
      </HomeWrapper>
    )
  }
}

const mapStateToProps = (state) => {
  const { search, recipe } = state
  return { ...search, ...recipe }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      searchRecipes: actions.searchRecipes,
      fetchRecipe: actions.fetchRecipe,
    },
    dispatch
  )

export default connect(mapStateToProps, mapDispatchToProps)(Home)
