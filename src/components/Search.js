import React, { useState, useEffect, useRef } from "react"
import { act } from "react-dom/cjs/react-dom-test-utils.production.min"
// import Pagination from "react-js-pagination"
import ReactPaginate from "react-paginate"

import Card from "../UI/Card"
import "./Search.css"

const Search = React.memo(() => {
  const [enteredFilter, setEnteredFilter] = useState("")
  const [gifArray, setGifArray] = useState([{ id: 0, title: "", url: "" }])
  const [activePage, setActivePage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [foundGifs, setFoundGifs] = useState(false)
  const inputRef = useRef()
  const limit = 5

  const handleFetch = () => {
    let offset = activePage * limit - (limit - 1) //offset=0 or undefined causes response.ok==false, then it has to start at 1.
    const query = `?q="${enteredFilter}"&api_key=dc6zaTOxFJmzC&limit=${limit}&offset=${offset}`

    console.log("query", query)
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
            setTotalCount(response.pagination.total_count)
          }
          setGifArray(gifAuxArray)
        } else {
          setGifArray([{ id: 0, title: "", url: "" }])
          setTotalCount(0)
          setActivePage(1) ////
          //no Gifs found
        }
      })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        enteredFilter === inputRef.current.value &&
        enteredFilter.length !== 0
      ) {
        setActivePage(1) /////
        handleFetch()
      }
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, inputRef]) //this rerenders only when the filter is changed, not when the page is changed

  const handlePageChange = (pageNumber) => {
    console.log("selected", pageNumber.selected)
    let page = pageNumber.selected + 1
    setActivePage(page)
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
          previousLinkClassName={"page"}
          breakClassName={"page"}
          nextLinkClassName={"page"}
          pageClassName={"page"}
          disabledClassNae={"disabled"}
          activeClassName={"active"}
        />
      </div>
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
