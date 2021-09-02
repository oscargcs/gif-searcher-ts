import React from "react"

import "./IngredientList.css"

const GiphyDisplayer = (props) => {
  return (
    <section className="ingredient-list">
      {props.gifArray.map((item) => {
        return <img src={item.url} alt="Searched gifs" />
      })}
    </section>
  )
}
