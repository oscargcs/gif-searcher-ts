import React, { useState, useEffect, useRef } from "react"
// import Pagination from "react-js-pagination"
// require("bootstrap/less/bootstrap.less")

import Card from "../UI/Card"
import "./Search.css"

const Search = React.memo((props) => {
  const { onLoadIngredients } = props
  const [enteredFilter, setEnteredFilter] = useState("")
  const [gifArray, setGifArray] = useState([{ id: 0, title: "", url: "" }])
  const [activePage, setActivePage] = useState(1)
  const [foundGifs, setFoundGifs] = useState(false)
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        enteredFilter === inputRef.current.value &&
        enteredFilter.length !== 0
      ) {
        const query = `?q="${enteredFilter}"&api_key=dc6zaTOxFJmzC&limit=5`
        fetch("http://api.giphy.com/v1/gifs/search" + query) // Example'http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5&offset=4'
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
              console.log("response", response)
              const gifAuxArray = []
              for (const key in response.data) {
                gifAuxArray.push({
                  id: key,
                  title: response.data[key].images.original.title,
                  url: response.data[key].images.original.url,
                })
                // setTotalCount(response.pagination.total_count)
              }
              setGifArray(gifAuxArray)
            } else {
              setGifArray([{ id: 0, title: "", url: "" }])
              // setTotalCount(0)
              //no Gifs found
            }
          })
      }
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, inputRef])

  // handlePageChange(pageNumber) {
  //   console.log(`active page is ${pageNumber}`);
  //   setActivePage(pageNumber);
  // }

  return (
    <section className="search">
      <div>
        <h1 align="center">GIPHY SEARCHER</h1>
      </div>
      <Card>
        <div className="search-input">
          <label>Search your gifs</label>
          <input
            ref={inputRef}
            type="text"
            value={enteredFilter}
            onChange={(event) => setEnteredFilter(event.target.value)}
          />
          {/* <Pagination
          activePage={activePage}
          itemsCountPerPage={10}
          totalItemsCount={450}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          /> */}
          {/* {totalCount !== 0 && <h4>5 results out of {totalCount}</h4>} */}
        </div>
      </Card>
      <div>
        {foundGifs ? (
          gifArray.map((item) => {
            return <img src={item.url} alt="Searched gifs" />
          })
        ) : (
          <h2>No gifs found according to your search</h2>
        )}
      </div>
    </section>
  )
})
//al div farem gifArray.map((item)=>{<img src={item.url} alt="Searched gifs" />})

export default Search
