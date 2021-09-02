import React, { useState, useEffect, useRef } from "react"

import Card from "../UI/Card"
import "./Search.css"

const Search = React.memo((props) => {
  const { onLoadIngredients } = props
  const [enteredFilter, setEnteredFilter] = useState("")
  const [url, setUrl] = useState("")
  //const [gifArray, setGifArray] = useState([])
  const [foundGifs, setFoundGifs] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        enteredFilter === inputRef.current.value &&
        enteredFilter.length !== 0
      ) {
        const query = `?q="${enteredFilter}"&api_key=dc6zaTOxFJmzC&limit=5`
        fetch("http://api.giphy.com/v1/gifs/search" + query) // Example'http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5'
          .then((response) => {
            console.log("response.ok", response.ok)
            if (response.ok) {
              setFoundGifs(true)
              return response.json()
            } else {
              setFoundGifs(false)
            }
          })
          .then((response) => {
            if (typeof response !== "undefined") {
              // typeof is necessary (very important concept)
              console.log("response", response.data)
              setUrl(response.data[1].images.original.url)
              //     const gifAuxArray = []
              //     for (const key in response) {
              //     gifAuxArray.push({
              //     id: key,
              //     title: response.data[key].images.original.title,
              //     url: response.data[key].images.original.url,
              //     })
              //     }
              // setGifArray(gifAuxArray)
            } else {
              setUrl("")
              //no Gifs found
            }
          })
      }
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, inputRef])

  return (
    <section className="search">
      <div>
        <h1>Giphy Searcher</h1>
      </div>
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
        </div>
      </Card>
      <div>
        {foundGifs && url ? (
          <img src={url} alt="Searched gifs" />
        ) : (
          <h2>No gifs found according to your search</h2>
        )}
      </div>
    </section>
  )
})
//al div farem gifArray.map((item)=>{<img src={item.url} alt="Searched gifs" />})

export default Search
