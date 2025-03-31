import React from 'react'
const categories = ["All", "Music", "Gaming", "Education", "News", "Dance","Sports","Adventure","Children"];
function CategoryFilter({ selectedCategory, onSelectCategory }) {
  return (
    <div className='category-filter'>
      {
        categories.map((category)=>(
            <button
            key={category}
                className={`tag-button ${selectedCategory === category ? "active" : ""}`}
                onClick={() => onSelectCategory(category)}
            >
                {category}
            </button>
        ))
      }
    </div>
  )
}

export default CategoryFilter
