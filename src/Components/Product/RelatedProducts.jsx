import React from 'react';

import './ProductItem.css';
import './RelatedProducts.css';

const RelatedProducts = ({ product}) => {

    return (
        <>
            <div className='related' style={{backgroundSize:'cover', backgroundRepeat:'no-repeat',backgroundImage:`url(${product.images.url})`}}>
                {/* this image is needed in order for the div's height to scale to the image */}
                <img src={product.images.url} alt="product" style={{visibility: "hidden", maxWidth:"100%", maxHeight:'100%'}}/>
            </div>
            <section id="team">
              <div class="container">
                  <div class="row justify-content-center">
                      <div class="col-md-6">
                        <h2>Meet Our Team</h2>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry’s standard dummy text</p>
                      </div>
                  </div>
                  <div class="row">
                      <div class="col-lg-3 col-md-6">
                          <div class="member">
                            <div class="member-img">
                                <img src="/images/img-500x500-1.jpg" class="img-fluid" alt=""/>
                            </div>
                              <div class="member-info">
                                  <h4>Gaurav Kumar</h4>
                                  <span>Web Designer</span>
                                  <div class="social-links">
                                      <a href="#"><i class="fab fa-facebook-f"></i></a>
                                      <a href="#"><i class="fab fa-twitter"></i></a>
                                      <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                      <a href="#"><i class="fab fa-pinterest-p"></i></a>
                                      <a href="#"><i class="fab fa-instagram"></i></a>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="col-lg-3 col-md-6">
                          <div class="member">
                            <div class="member-img">
                                <img src="/images/img-500x500-1.jpg" class="img-fluid" alt=""/>
                            </div>
                              <div class="member-info">
                                  <h4>Parveen Singh</h4>
                                  <span>Web Developer</span>
                                  <div class="social-links">
                                      <a href="#"><i class="fab fa-facebook-f"></i></a>
                                      <a href="#"><i class="fab fa-twitter"></i></a>
                                      <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                      <a href="#"><i class="fab fa-pinterest-p"></i></a>
                                      <a href="#"><i class="fab fa-instagram"></i></a>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="col-lg-3 col-md-6">
                          <div class="member">
                            <div class="member-img">
                                <img src="/images/img-500x500-1.jpg" class="img-fluid" alt=""/>
                            </div>
                              <div class="member-info">
                                  <h4>Pardeep Kumar</h4>
                                  <span>SEO Expert</span>
                                  <div class="social-links">
                                      <a href="#"><i class="fab fa-facebook-f"></i></a>
                                      <a href="#"><i class="fab fa-twitter"></i></a>
                                      <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                      <a href="#"><i class="fab fa-pinterest-p"></i></a>
                                      <a href="#"><i class="fab fa-instagram"></i></a>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div class="col-lg-3 col-md-6">
                          <div class="member">
                            <div class="member-img">
                                <img src="/images/img-500x500-1.jpg" class="img-fluid" alt=""/>
                            </div>
                              <div class="member-info">
                                  <h4>Gurdeep Singh</h4>
                                  <span>ISO Developer</span>
                                  <div class="social-links">
                                      <a href="#"><i class="fab fa-facebook-f"></i></a>
                                      <a href="#"><i class="fab fa-twitter"></i></a>
                                      <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                      <a href="#"><i class="fab fa-pinterest-p"></i></a>
                                      <a href="#"><i class="fab fa-instagram"></i></a>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
        </>
    )
}

export default RelatedProducts;
