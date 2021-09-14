import React from "react"
import Data from "../models/data"
import LoadingIndicator from "../UI/LoadingIndicator"

import "./GifDisplayer.css"

const GifDisplayer: React.FC<{
  isLoading: boolean
  foundGifs: boolean
  gifArray: Data[]
}> = (props) => {
  return (
    <div className="row">
      {props.isLoading && <LoadingIndicator />}
      {props.foundGifs
        ? props.gifArray.map((item: any) => {
            return (
              <div key={item.id} className="column">
                <img src={item.url} alt="Searched gifs" />
              </div>
            )
          })
        : !props.foundGifs && <h2>No gifs found according to your search</h2>}
    </div>
  )
}

export default GifDisplayer
