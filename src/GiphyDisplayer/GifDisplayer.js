import React from "react"
import LoadingIndicator from "../UI/LoadingIndicator"

import "./GifDisplayer.css"

const GifDisplayer = (props) => {
  return (
    <div className="row">
      {props.isLoading && <LoadingIndicator />}
      {props.foundGifs ? (
        props.gifArray.map((item) => {
          return (
            <div key={item.id} className="column">
              <img src={item.url} alt="Searched gifs" />
            </div>
          )
        })
      ) : (
        <h2>No gifs found according to your search</h2>
      )}
    </div>
  )
}

export default GifDisplayer
