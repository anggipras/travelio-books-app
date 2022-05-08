import './App.css';
import 'bulma/css/bulma.min.css'
import { useEffect, useState } from 'react';
import axios from 'axios';
import StarGrey from "./assets/icon/star_grey.png";
import StarYellow from "./assets/icon/star_yellow.png";
import StarHalf from "./assets/icon/star_half.png";
import ReactStars from 'react-rating-stars-component';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faHeart } from '@fortawesome/free-solid-svg-icons'
import { address } from './Uri';
import LoadingOverlay from 'react-loading-overlay';
import { Circles } from  'react-loader-spinner'

function App() {
  const [books, setBooks] = useState([
    {
      title: "", //strings
      authors: [], //array of strings
      smallThumbnail: "", //strings
      thumbnail: "", //strings
      averageRating: 0, //integer
    }
  ])
  const [favBooks, setFavBooks] = useState([
    {
      _id: null, //strings
      title: "", //strings
      authors: [], //array of strings
      smallThumbnail: "", //strings
      thumbnail: "", //strings
      averageRating: 0, //integer
      ammountFav: 0, //long
    }
  ])
  const [tab, setTab] = useState(0)
  const [loading, setLoading] = useState(false)
  const [favLoading, setFavLoading] = useState(false)

  useEffect(() => {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=a`)
    .then(res => {
      let arrayofBooksResponse = []
      res.data.items.forEach(val => {
        arrayofBooksResponse.push({
          title: val.volumeInfo.title ? val.volumeInfo.title : null, //strings
          authors: val.volumeInfo.authors ? val.volumeInfo.authors : [], //array of strings
          smallThumbnail: val.volumeInfo.imageLinks ? val.volumeInfo.imageLinks.smallThumbnail : null, //strings
          thumbnail: val.volumeInfo.imageLinks ? val.volumeInfo.imageLinks.thumbnail : null, //strings
          averageRating: val.volumeInfo.averageRating ? val.volumeInfo.averageRating : 0
        })
      })
      setBooks(arrayofBooksResponse)
    }).catch(err => console.log(err))
  }, [])

  const searchBooks = (e) => {
    if (e.target.value === "") {
      getBookListBySearch("a")
    } else {
      getBookListBySearch(e.target.value)
    }
  }

  const getBookListBySearch = (e) => {
    axios.get(`https://www.googleapis.com/books/v1/volumes?q=${e}`)
    .then(res => {
      let arrayofBooksResponse = []
      res.data.items.forEach(val => {
        arrayofBooksResponse.push({
          title: val.volumeInfo.title ? val.volumeInfo.title : null, //strings
          authors: val.volumeInfo.authors ? val.volumeInfo.authors : [], //array of strings
          smallThumbnail: val.volumeInfo.imageLinks ? val.volumeInfo.imageLinks.smallThumbnail : null, //strings
          thumbnail: val.volumeInfo.imageLinks ? val.volumeInfo.imageLinks.thumbnail : null, //strings
          averageRating: val.volumeInfo.averageRating ? val.volumeInfo.averageRating : 0
        })
      })
      setBooks(arrayofBooksResponse)
    }).catch(err => console.log(err))
  }

  const getFavBookList = () => {
    setFavLoading(true)
    axios.get(`${address}fav/list`)
    .then(res => {
      let arrayofBooksResponse = []
      res.data.forEach(val => {
        arrayofBooksResponse.push({
          _id: val._id,
          title: val.title,
          authors: val.authors,
          smallThumbnail: val.smallThumbnail,
          thumbnail: val.thumbnail,
          averageRating: val.averageRating,
          ammountFav: val.ammountFav
        })
      })
      setFavLoading(false)
      setFavBooks(arrayofBooksResponse)
    }).catch(err => console.log(err))
  }

  const booksAuthorList = (authorList) => {
    let authorString = ""
    authorList.forEach((el, ind) => {
      if (ind === authorList.length - 1) {
        authorString += `${el}`
      } else {
        authorString += `${el}, `
      }
    });
    return authorString
  }

  const ratingValue = (e) => {
    if (e < 5 && e > 4) {
      return 4.5
    } else if(e < 4 && e > 3) {
        return 3.5
    } else if(e < 3 && e > 2) {
        return 2.5
    } else if(e < 2 && e > 1) {
        return 1.5
    } else {
      return e
    }
  }

  const saveToFav = (bookObject) => {
    setLoading(true)
    axios({
      method: 'post',
      url: `${address}fav/record`,
      data: bookObject
    }).then((res) => {
      setLoading(false)
      Swal.fire({
        position: 'top',
        icon: 'success',
        title: 'Added to Favourite',
        showConfirmButton: false,
        timer: 1500
      })
    }).catch((err) => console.log(err))
  }

  const bookList = () => {
    return books.map((val, ind) => {
      return (
        <div key={ind} class="column is-3" style={{cursor: 'pointer'}}>
          <div class="card" onClick={() => saveToFav(val)}>
            <div class="card-image">
              <figure class="image" style={{overflow: 'hidden', width: '100%', height: '150px'}}>
                <img style={{objectFit: 'cover'}} src={val.thumbnail} alt="" />
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src={val.smallThumbnail} alt="" />
                  </figure>
                </div>
                <div class="media-content" style={{overflowY: "hidden"}}>
                  <p class="title is-4">{val.title}</p>
                  <p class="subtitle is-6">{booksAuthorList(val.authors)}</p>
                </div>
              </div>

              <div class="content">
                {
                  val.averageRating > 0 ?
                  <ReactStars
                    count={5}
                    value={ratingValue(val.averageRating)}
                    edit={false}
                    emptyIcon={<img src={StarGrey} className='ml-2 mr-2' style={{width: '10px', height: '10px'}} alt='' />}
                    filledIcon={<img src={StarYellow} className='ml-2 mr-2' style={{width: '10px', height: '10px'}} alt='' />}
                    halfIcon={<img src={StarHalf} className='ml-2 mr-2' style={{width: '10px', height: '10px'}} alt='' />}
                  />:null
                }
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  const favBookList = () => {
    return favBooks.map((val, ind) => {
      return (
        <div key={ind} class="column is-3">
          <div class="card">
            <div class="card-image">
              <figure class="image" style={{overflow: 'hidden', width: '100%', height: '150px'}}>
                <img style={{objectFit: 'cover'}} src={val.thumbnail} alt="" />
              </figure>
            </div>
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-48x48">
                    <img src={val.smallThumbnail} alt="" />
                  </figure>
                </div>
                <div class="media-content" style={{overflowY: "hidden"}}>
                  <p class="title is-4">{val.title}</p>
                  <p class="subtitle is-6">{booksAuthorList(val.authors)}</p>
                </div>
              </div>

              <div class="content">
                {
                  val.averageRating > 0 ?
                  <ReactStars
                    count={5}
                    value={ratingValue(val.averageRating)}
                    edit={false}
                    emptyIcon={<img src={StarGrey} className='ml-2 mr-2' style={{width: '10px', height: '10px'}} alt='' />}
                    filledIcon={<img src={StarYellow} className='ml-2 mr-2' style={{width: '10px', height: '10px'}} alt='' />}
                    halfIcon={<img src={StarHalf} className='ml-2 mr-2' style={{width: '10px', height: '10px'}} alt='' />}
                  />:null
                }
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <FontAwesomeIcon icon={faHeart} />
                  <div style={{marginLeft: '5px'}}>{val.ammountFav}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    })
  }

  const changeTab = (ind) => {
    if (ind === 0) {
      getBookListBySearch("a")
    } else {
      getFavBookList()
    }
    setTab(ind)
  }

  return (
    <LoadingOverlay active={loading ? true : false} spinner text='Loading...'>
      <article class="panel is-danger" style={{boxShadow: 'none'}}>
        <div style={{ position: 'sticky', top: 0, zIndex: '3'}}>
          <p class="panel-heading">
            Travelio Books App
          </p>
          <p class="panel-tabs" style={{backgroundColor: 'white'}}>
            <a onClick={() => changeTab(0)}>All</a>
            <a onClick={() => changeTab(1)}>Favourite</a>
          </p>
          {
            tab === 0 ?
            <div class="panel-block" style={{backgroundColor: 'white'}}>
              <p class="control has-icons-left">
                <input onPaste={(e) => searchBooks(e)} onChange={(e) => searchBooks(e)} class="input is-danger" type="text" placeholder="Search" />
                <span class="icon is-left">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>
              </p>
            </div>
            :null
          }
        </div>

        <div class="container mt-5">
          <div class="columns is-multiline" style={{ minHeight: "100vh", justifyContent: favLoading ? 'center' : 'normal' }}>
          {
            tab === 0 ?
            bookList()
            :
              favLoading ?
              <div style={{display: 'flex', position: 'relative', alignItems: 'center'}}><Circles height="100" width="100" color='red' ariaLabel='loading' /></div>
              :
              favBookList()
          }
          </div>
        </div>
      </article>
    </LoadingOverlay>
  );
}

export default App;
