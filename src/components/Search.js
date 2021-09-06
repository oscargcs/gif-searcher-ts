import React, { useState, useEffect, useRef } from "react"

// import Pagination from "react-js-pagination"
import ReactPaginate from "react-paginate"

import Card from "../UI/Card"
import "./Search.css"

import GifDisplayer from "./GifDisplayer"

const Search = React.memo(() => {
  const [enteredFilter, setEnteredFilter] = useState("")
  const [gifArray, setGifArray] = useState([{ id: 0, title: "", url: "" }])
  const [totalCount, setTotalCount] = useState(0)
  const [foundGifs, setFoundGifs] = useState(false)
  const inputRef = useRef()
  const [statePage, setStatePage] = useState(1)
  const key = "dc6zaTOxFJmzC"
  const limit = 4
  var activePage = 1 //a variable is also needed to update the offset

  const handleFetch = () => {
    const offset = activePage * limit - (limit - 1) //offset=0 or undefined causes response.ok==false, then it has to start at 1.
    const query = `?q="${enteredFilter}"&api_key=${key}&limit=${limit}&offset=${offset}`

    console.log("query", query)
    fetch("http://api.giphy.com/v1/gifs/search" + query) // Example'http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=5&offset=4'
      .then((response) => {
        console.log("response.ok", response.ok)
        if (response.ok) {
          setFoundGifs(true)
          return response.json()
        } else {
          setFoundGifs(false)
          setGifArray([{ id: 0, title: "", url: "" }])
          setTotalCount(0)
          activePage = 1 ///
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
            setTotalCount(response.pagination.total_count)
          }
          setGifArray(gifAuxArray)
        } else {
          setGifArray([{ id: 0, title: "", url: "" }])
          setTotalCount(0)
          activePage = 1
        }
      })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        enteredFilter === inputRef.current.value &&
        enteredFilter.length !== 0
      ) {
        setStatePage(1)
        activePage = 1
        handleFetch()
      }
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, inputRef]) //this rerenders only when the filter is changed, not when the page is changed

  const handlePageChange = (pageNumber) => {
    console.log("selected", pageNumber.selected)
    setStatePage(pageNumber.selected + 1)
    activePage = pageNumber.selected + 1
    console.log("current page", activePage)
    handleFetch()
  }

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
          {/* {totalCount !== 0 && <h4>5 results out of {totalCount}</h4>} */}
        </div>
      </Card>
      <div>
        <ReactPaginate
          marginPagesDisplayed={2}
          pageCount={totalCount}
          pageRangeDisplayed={limit}
          onPageChange={handlePageChange}
          containerClassName={"container"}
          forcePage={statePage - 1} //this needs to be a state to effectively rerender the component
          previousLinkClassName={"page"}
          breakClassName={"page"}
          nextLinkClassName={"page"}
          pageClassName={"page"}
          disabledClassName={"disabled"}
          activeClassName={"active"}
        />
      </div>
      <GifDisplayer foundGifs={foundGifs} gifArray={gifArray} />
    </section>
  )
})

export default Search
