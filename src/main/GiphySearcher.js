import React, { useState, useEffect, useRef } from "react"

import ReactPaginate from "react-paginate"

import Card from "../UI/Card"
import "./GiphySearcher.css"

import GifDisplayer from "../GiphyDisplayer/GifDisplayer"
import useHandleFetch from "../hooks/useHandleFetch"

const GiphySearcher = React.memo(() => {
  const key = "dc6zaTOxFJmzC"
  const limit = 4
  var activePage = 1 //a variable is also needed to update the offset
  const [enteredFilter, setEnteredFilter] = useState("")
  const [statePage, setStatePage] = useState(1)
  const { gifArray, totalCount, foundGifs, handleFetch } = useHandleFetch(
    enteredFilter,
    limit
  )
  const inputRef = useRef()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        enteredFilter === inputRef.current.value &&
        enteredFilter.length !== 0
      ) {
        setStatePage(1)
        activePage = 1
        activePage = handleFetch(activePage, key)
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
    activePage = handleFetch(activePage, key)
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

export default GiphySearcher
