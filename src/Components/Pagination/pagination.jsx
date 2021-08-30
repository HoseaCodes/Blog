import React from 'react';
import './pagination.css';

const Pagination = ({currentPage, paginate, nextPage, prevPage, postsPerPage, totalPosts}) => {
    
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination justify-content-center">
                {currentPage === 1 ?  
                <li className="page-item disabled">
                    <a className="page-link" href="#!" onClick={(() => prevPage())}>Pervious</a>
                </li>
                :  
                <li className="page-item">
                    <a className="page-link" href="#!" onClick={(() => prevPage())}>Pervious</a>
                </li>}
                {pageNumbers.map((num) => {
                    if (currentPage === num) {
                        return (
                            <li className="page-item active" key={num}>
                                <a onClick={() => paginate(num)} className="page-link" href="#!">{num}</a>
                            </li>
                            )
                        } else {
                            return (
                                <li className="page-item" key={num}>
                                    <a onClick={() => paginate(num)} className="page-link" href="#!">{num}</a>
                                </li>
                            )
                        }
                })}
                 {currentPage === totalPosts / postsPerPage ?  
                <li className="page-item disabled">
                    <a className="page-link" href="#!" onClick={(() => nextPage())}>Next</a>
                </li>
                :  
                <li className="page-item">
                    <a className="page-link" href="#!" onClick={(() => nextPage())}>Next</a>
                </li>}
            </ul>
        </nav>
    )
}

export default Pagination;