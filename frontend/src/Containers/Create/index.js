// TODO Create a connected component to render a fetched recipe

import { Button } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from "redux"
import * as actions from "../../actions"

export class RecipeCreator extends Component {
    constructor(props) {
        super(props)
        this.updateName = this.updateName.bind(this);
        this.updateInstructions = this.updateInstructions.bind(this);
        this.updateIngredient = this.updateIngredient.bind(this);
        this.saveRecipe = this.saveRecipe.bind(this);

        this.state = {
            name: "",
            ingredients: [],
            instructions: "",
        }
    }

    updateName = (event) => {
        this.setState({ name: event.target.value })
    }
    updateInstructions = (event) => {
        this.setState({ instructions: event.target.value })
    }
    updateIngredient = (event) => {
        this.setState({ ingredients: event.target.value.split(',') })
    }
    saveRecipe = () => {
        this.props.createRecipe({
            name: this.state.name,
            instructions: this.state.instructions,
            ingredients: this.state.ingredients.map(i => {
                return {
                    name: i,
                    amount: 1,
                    unit: "cup"
                }
            })
        })
    }

    render () {
        const { recipe } = this.props;
        return (
            <div>
                <h1> Create a Recipe </h1>
                {/* Go to home page */}
                <Button onClick={() => this.props.history.push('/')}>Home</Button>
                <div>
                    <label>Name</label>
                    <input type="text" onChange={this.updateName} />

                    <label>Ingredients</label>
                    <input type="text" onChange={this.updateIngredient} />

                    <label>Instructions</label>
                    <input type="text" onChange={this.updateInstructions} />

                    <button onClick={this.saveRecipe}>Save</button>
                </div>
                <div>
                    <h2>Preview</h2>
                    <h3>{this.state.name}</h3>
                    <ul>
                        {this.state.ingredients.map((ingredient, i) => <li key={i}>{ingredient}</li>)}
                    </ul>
                    <p>{this.state.instructions}</p>
                </div>
                {recipe && <div>
                    <h2>Created Recipe</h2>
                    <h3>{recipe.name}</h3>
                    <ul>
                        {recipe.ingredients.map((ingredient, i) => <li key={i}>{ingredient.name}</li>)}
                    </ul>
                    <p>{recipe.instructions}</p>
                </div>}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { create } = state
    return { ...create }
}

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            createRecipe: actions.createRecipe
        },
        dispatch
    )

export default connect(mapStateToProps, mapDispatchToProps)(RecipeCreator)
