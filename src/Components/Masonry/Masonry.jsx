import React, {useContext, useState} from 'react';
import './Masonry.css';
import { GlobalState } from '../../GlobalState';
import ProLoader from '../Loading/ProLoader';
import axios from 'axios'

const Masonry = () => {
  const state = useContext(GlobalState)
  const [products, setProducts] = state.productsAPI.products
  const [isAdmin] = state.userAPI.isAdmin
  const [token] = state.token
  const [callback, setCallback] = state.productsAPI.callback
  const [loading, setLoading] = useState(false)
  const [isCheck, setIsCheck] = useState(false)

  const deleteProduct = async (id, public_id) => {
    try {
        setLoading(true)
        const destroyImg = axios.post('/api/destory', { public_id }, {
            headers: { Authorization: token }
        })
        const deleteProduct = axios.delete(`/api/products/${id}`, {
            headers: { Authorization: token }
        })
        await destroyImg
        await deleteProduct
        setLoading(false)
        setCallback(!callback)
    } catch (err) {
        alert(err.response.data.msg, err)
    }
}
// const handleCheck = async (id) => {
//   products.forEach(product => {
//       if (product._id === id) product.checked = !product.checked
//   })
//   setProducts([...products])
// }

const checkAll = () => {
  products.forEach(product => {
      product.checked = !isCheck
  })
  setProducts([...products])
  setIsCheck(!isCheck)
}

const deleteAll = () => {
  products.forEach(product => {
      if (product.checked) deleteProduct(product._id, product.images.id)
  })
}
/* for responsive masonry layout */
// const breakpointColumnsObj = {
//   default: 3,
//   1400: 2,
//   900: 1
// };

if (loading) return <div><ProLoader /></div>
  return (
    <>
     {
                isAdmin &&
                <div className="delete-all">
                    <span>Select All</span>
                    <input type="checkbox" checked={isCheck} onChange={checkAll} />
                    <button onClick={deleteAll}>Delete All</button>
                </div>
            }
    <div class="middle-div">
      <h2>Masonry Grid With CSS</h2>
      <p>Responsive masonry layout using CSS grid</p>
      <div class="masonry-grid">
        <div class="review-item">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2xvdGhpbmclMjBzdG9yZXxlbnwwfHwwfHw%3D&w=1000&q=80" />
        </div>

        <div class="review-item">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s. Lorem Ipsum is simply dummy text of the
            printing and typesetting industry. Lorem Ipsum has been the
            industry's standard dummy text{" "}
          </p>
        </div>

        <div class="review-item">
          <img src="https://images.unsplash.com/photo-1595665593673-bf1ad72905c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2xvdGhpbmclMjBzdG9yZXxlbnwwfHwwfHw%3D&w=1000&q=80" />
        </div>

        <div class="review-item">
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. Lorem
            Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </p>
        </div>

        <div class="review-item">
          <img src="https://cdn.cnn.com/cnnnext/dam/assets/220119153547-embargoed-01-amazon-style-in-store-shopping-full-169.jpg" />
        </div>

        <div class="review-item">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry's standard
            dummy text. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
        </div>

        <div class="review-item">
          <img src="https://static01.nyt.com/images/2018/03/29/fashion/29BOYDS1/merlin_136027200_dbf5e18b-9385-4bd5-9c0d-a3d00df4cdfa-superJumbo.jpg" />
        </div>

        <div class="review-item">
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. Lorem
            Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's. The point of using Lorem Ipsum
            is that it has a more-or-less normal distribution of letters, as
            opposed to using 'Content here, content here', making it look like
            readable English.
          </p>
        </div>

        <div class="review-item">
          <img src="https://lofficiel.imgix.net/production/middleeast/images/1611726566274101-mens-paris-fahsion-week-2021.jpg?w=1920&h=800&fit=fill&crop=faces&auto=%5B%22format%22%2C%20%22compress%22%5D&cs=srgb" />
        </div>

        <div class="review-item">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
        </div>

        <div class="review-item">
          <img src="https://hips.hearstapps.com/harpersbazaaruk.cdnds.net/17/04/1485538441-galia-lahav1.jpg" />
        </div>

        <div class="review-item">
          <img src="https://cache2.senatus.net/files/myerscms/senatus_PENa6T.jpeg?versionId=gubF4nYwh2OG0UCH1hUtE491dyEG4GVt" />
        </div>

        <div class="review-item">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
        </div>

        <div class="review-item">
          <img src="https://www.elle.vn/wp-content/uploads/2019/01/13/elle-viet-nam-thoi-trang-cao-cap-haute-couture-2.jpg" />
        </div>

        <div class="review-item">
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. Lorem
            Ipsum is simply dummy text of the printing and typesetting industry.
            Lorem Ipsum has been the industry's standard dummy text. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </p>
        </div>

        <div class="review-item">
          <img src="https://4.bp.blogspot.com/__PbVrQyybs0/TRnI6VZPXpI/AAAAAAAAAYo/FNAbI0plNWA/s1600/c3.JPG" />
        </div>

        <div class="review-item">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum is simply dummy text of the printing and
            typesetting industry. Lorem Ipsum has been the industry's standard
            dummy text. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
        </div>

        <div class="review-item">
          <img src="https://qph.fs.quoracdn.net/main-qimg-456e98b08c298939ac2228aa7f57933e-lq" />
        </div>

        <div class="review-item">
          <p>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English.
          </p>
        </div>

        <div class="review-item">
          <img src="https://image.jimcdn.com/app/cms/image/transf/none/path/s552b8759839fb1e8/image/i64b78ca21f8d247b/version/1613289234/image.jpg" />
        </div>

        <div class="review-item">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s
          </p>
        </div>

        <div class="review-item">
          <img src="http://cdn.cnn.com/cnnnext/dam/assets/200124142221-17-paris-fashion-week-couture-spring-summer-2020.jpg" />
        </div>
      </div>
    </div>
    </>
  )
}

export default Masonry;
