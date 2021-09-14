import React from "react"

import "./Card.css"

const Card: React.FC<{ children: any }> = (props) => {
  return <div className="card">{props.children}</div>
}

export default Card
