// TODO Create a connected component to render a fetched recipe

import React, { Component } from "react";
import { connect } from 'react-redux';


export class RecipeInspector extends Component {
    constructor(props) {
        super(props)
        this.getSetOfIngredients = this.getSetOfIngredients.bind(this)
    }

    getSetOfIngredients = () => {
        const { selectedRecipe } = this.props;
        const setOfIngredients = new Set();
        selectedRecipe.ingredients.forEach(ingredient => { setOfIngredients.add(ingredient.name) });
        return Array.from(setOfIngredients);
    }

    render () {
        const { selectedRecipe } = this.props;
        return (
            <div>
                <h1> {selectedRecipe.name} </h1>
                <h2> Ingredients </h2>
                <div>
                    <ul>
                        {this.getSetOfIngredients().map(ingredient => <li key={ingredient}> {ingredient} </li>)}
                    </ul>
                </div>
                <h2> Instructions </h2>
                <ul>
                    {selectedRecipe.ingredients.map((ingredient, index) => {
                        return (
                            <li key={index}>
                                {ingredient.amount} {ingredient.unit} of {ingredient.name}
                            </li>
                        )
                    })}
                </ul>
                <p> {selectedRecipe.instructions} </p>

            </div>
        )
    }
}

const mapStateToProps = (state) => {
    const { recipe } = state
    return { selectedRecipe: recipe.recipe }
}

export default connect(mapStateToProps, null)(RecipeInspector)
