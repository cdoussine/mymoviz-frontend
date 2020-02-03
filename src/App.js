import React, { Component } from 'react';
import {
  Row,
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Movie from './Movie';

class App extends Component {
  constructor(props) {
    super(props);
    this.toggleNavBar = this.toggleNavBar.bind(this);
    this.togglePopOver = this.togglePopOver.bind(this);
    this.handleClickLikeOn = this.handleClickLikeOn.bind(this);
    this.handleClickLikeOff = this.handleClickLikeOff.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isOpenNavBar: false,
      isOpenPopOver: false,
      viewOnlyLike: false,
      movies: [],
      moviesCount: 0,
      moviesNameList: [],
      moviesLiked: []
    };
  }

  toggleNavBar() {
    this.setState({
      isOpenNavBar: !this.state.isOpenNavBar
    });
  }

  togglePopOver() {
    this.setState({
      isOpenPopOver: !this.state.isOpenPopOver
    });
  }

  handleClick(isLike, name) {
    console.log('click détected from App');

    var moviesNameListCopy = [...this.state.moviesNameList];

    if (!isLike) {
      moviesNameListCopy.push(name);

      this.setState({
        moviesCount: this.state.moviesCount + 1,
        moviesNameList: moviesNameListCopy
      });
    } else {
      var index = moviesNameListCopy.indexOf(name);
      moviesNameListCopy.splice(index, 1);

      this.setState({
        moviesCount: this.state.moviesCount - 1,
        moviesNameList: moviesNameListCopy
      });
    }
  }

  handleClickLikeOn() {
    console.log('Click detected on Mymovies');
    this.setState({
      viewOnlyLike: true
    });
  }

  handleClickLikeOff() {
    console.log('Click detected on LastReleases');
    this.setState({
      viewOnlyLike: false
    });
  }

  componentWillMount() {
    var ctx = this;
    /* Films récents */
    fetch('http://localhost:3000/movies')
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        ctx.setState({
          movies: data.body.results
        });
      })
      .catch(function(error) {
        console.log('Request failed', error);
      });

    /* Films favoris */
    fetch('http://localhost:3000/mymovies')
      .then(function(response) {
        return response.json();
      })
      .then(function(movies) {
        var moviesNameListCopy = movies.data.map(movie => {
          return movie.title;
        });
        ctx.setState({
          moviesLiked: movies.data,
          moviesCount: movies.data.length,
          moviesNameList: moviesNameListCopy
        });
      })
      .catch(function(error) {
        console.log('Request failed ->', error);
      });
  }

  render() {
    //console.log('Movies count', this.state.moviesCount);

    var moviesNameList = this.state.moviesNameList;
    var moviesLast;

    //  We need to have the LAST 3 movies, so we start at the end of the array, so moviesNameList[moviesCount-1] is our last element in moviesNameList, we need to have 3 movies
    var lastMovie1 = moviesNameList[moviesNameList.length - 1];
    var lastMovie2 = moviesNameList[moviesNameList.length - 2];
    var lastMovie3 = moviesNameList[moviesNameList.length - 3];

    // if there is only one movie, or 2 movies, or 3 movies, or more....
    if (moviesNameList.length === 0) {
      moviesLast = 'Aucun film sélectionné';
    }
    if (moviesNameList.length === 1) {
      moviesLast = lastMovie1;
    }
    if (moviesNameList.length === 2) {
      moviesLast = `${lastMovie1}, ${lastMovie2} `;
    }
    if (moviesNameList.length >= 3) {
      moviesLast = `${lastMovie1}, ${lastMovie2}, ${lastMovie3}...`;
    }

    //console.log(`Here is moviesLast : ${moviesLast}`);

    // map method to loop on moviesData
    var moviesData = this.state.movies;
    var moviesLiked = this.state.moviesLiked;

    //console.log(moviesLiked, moviesLiked.length);

    var movieList = moviesData.map((movie, i) => {
      var isLiked = false;
      for (var j = 0; j < moviesLiked.length; j++) {
        if (moviesLiked[j].idMovieDB === movie.id) {
          isLiked = true;
        }
      }

      //if (isLiked) console.log(movie.title, 'isLiked', isLiked);
      var img = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
      return (
        <Movie
          key={i}
          idMovie={movie.id}
          movieName={movie.title}
          movieDesc={movie.overview}
          movieImg={img}
          movieLiked={isLiked}
          displayOnlyLike={this.state.viewOnlyLike}
          handleClickParent={this.handleClick}
        />
      );
    });

    return (
      <div>
        {/* Header --NAVBAR */}
        <div style={{ marginBottom: 90 }}>
          <Navbar color='dark' dark expand='md' fixed='top'>
            <span className='navbar-brand'>
              <img
                src='./logo.png'
                width='30'
                height='30'
                className='d-inline-block align-top'
                alt='logo myMoviz'
              />
            </span>
            <NavbarToggler onClick={this.toggleNavBar} />
            <Collapse isOpen={this.state.isOpenNavBar} navbar>
              <Nav className='' navbar>
                <NavItem>
                  <NavLink
                    href='#'
                    style={{ color: '#FFFFFF' }}
                    onClick={this.handleClickLikeOff}
                  >
                    Last Releases
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href='#'
                    style={{ color: '#FFFFFF', marginRight: 10 }}
                    onClick={this.handleClickLikeOn}
                  >
                    My Movies
                  </NavLink>
                </NavItem>
                <Button
                  id='Popover1'
                  onClick={this.togglePopOver}
                  color='secondary'
                >
                  {this.state.moviesCount} films
                </Button>
                <Popover
                  placement='bottom'
                  isOpen={this.state.isOpenPopOver}
                  target='Popover1'
                  toggle={this.togglePopOver}
                >
                  <PopoverHeader>Derniers films</PopoverHeader>
                  <PopoverBody>{moviesLast}</PopoverBody>
                </Popover>
              </Nav>
            </Collapse>
          </Navbar>
        </div>

        <Container>
          <Row>{movieList}</Row>
        </Container>
      </div>
    );
  }
}

export default App;
