import { useState, useEffect, useRef } from "react"

import ReactPaginate from "react-paginate"

import Card from "../UI/Card"
import "./GiphySearcher.css"

import GifDisplayer from "../GiphyDisplayer/GifDisplayer"
import useHandleFetch from "../hooks/useHandleFetch"

const GiphySearcher = () => {
  const apiKey: string = "dc6zaTOxFJmzC"
  const limit: number = 4
  var activePage: number = 1
  const [enteredFilter, setEnteredFilter] = useState<string>("")
  const [statePage, setStatePage] = useState<number>(1)
  const { gifArray, totalCount, foundGifs, isLoading, handleFetch } =
    useHandleFetch()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        enteredFilter === inputRef.current?.value &&
        enteredFilter.length !== 0
      ) {
        setStatePage(1)
        activePage = 1
        activePage = handleFetch(enteredFilter, activePage, apiKey, limit)
      }
    }, 300)
    return () => {
      clearTimeout(timer)
    }
  }, [enteredFilter, inputRef])

  const handlePageChange = (pageNumber: any) => {
    setStatePage(pageNumber.selected + 1)
    activePage = pageNumber.selected + 1
    activePage = handleFetch(enteredFilter, activePage, apiKey, limit)
  }

  return (
    <section className="search">
      <div>
        <h1 className="h1">GIPHY SEARCHER</h1>
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
          forcePage={statePage - 1}
          previousLinkClassName={"page"}
          breakClassName={"page"}
          nextLinkClassName={"page"}
          pageClassName={"page"}
          disabledClassName={"disabled"}
          activeClassName={"active"}
        />
      </div>
      <GifDisplayer
        foundGifs={foundGifs}
        gifArray={gifArray}
        isLoading={isLoading}
      />
    </section>
  )
}

export default GiphySearcher
