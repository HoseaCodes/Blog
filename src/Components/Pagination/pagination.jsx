import React from 'react';

const Pagination = ({paginate, nextPage, prevPage, postsPerPage, totalPosts}) => {
    
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }
    
    return (
        <nav>
            <ul className="pagination justify-content-center">
                <li className="page-item">
                    <a className="page-link" href="#!" onClick={(() => prevPage())}>Pervious</a>
                </li>
                {pageNumbers.map((num) => {
                    return (
                        <li className="page-item" key={num}>
                            <a onClick={() => paginate(num)} className="page-link" href="#!">{num}</a>
                        </li>
                    )
                })}
                <li className="page-item">
                    <a className="page-link" href="#!" onClick={(() => nextPage())}>Next</a>
                </li>
            </ul>
        </nav>
    )
}

export default Pagination;