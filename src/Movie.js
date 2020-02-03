import React, { Component } from 'react';
import { Col, Card, CardImg, CardText, CardBody, CardTitle } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

class Movie extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      selected: this.props.movieLiked
    };
  }

  handleClick() {
    //Log to check if the click is detected
    console.log('Click detected on the heart picto');

    //We use setState to change our selected state when we click on the picto
    this.setState({
      selected: !this.state.selected
    });

    /*
    var body = JSON.stringify({
      idMovieDB: this.props.idMovie,
      title: this.props.movieName,
      overview: this.props.movieDesc,
      poster_path: this.props.movieImg
    });

    console.log('body', body);
    */

    if (!this.state.selected) {
      fetch('http://localhost:3000/mymovies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `title=${this.props.movieName}&overview=${this.props.movieDesc}&poster_path=${this.props.movieImg}&idMovieDB=${this.props.idMovie}`
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log('Data', data);
        })
        .catch(function(error) {
          console.log('Request failed', error);
        });
    } else {
      var url = 'http://localhost:3000/mymovies/' + this.props.idMovie;
      fetch(url, {
        method: 'DELETE'
      })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log('Data', data);
        })
        .catch(function(error) {
          console.log('Request failed', error);
        });
    }

    // We execute from the parent directly
    this.props.handleClickParent(this.state.selected, this.props.movieName);
  }

  render() {
    var styleHeart = {
      color: '#F7F7F7',
      position: 'absolute', //VERY IMPORTANT
      top: '5%',
      left: '80%',
      cursor: 'pointer'
    };

    var movieStyle = {
      marginBottom: '30px',
      display: 'block'
    };

    // If we click on the heard, we change the color to red
    if (this.state.selected) {
      styleHeart.color = '#fc6861';
    }

    var display = '';

    if (this.props.displayOnlyLike && !this.state.selected) {
      display = 'none';
    }

    return (
      <Col xs='12' sm='6' md='4' lg='3' style={{ display }}>
        <div style={movieStyle}>
          <Card>
            <CardImg
              top
              width='100%'
              src={this.props.movieImg}
              alt='Card image cap'
            />
            <FontAwesomeIcon
              size='2x'
              style={styleHeart}
              icon={faHeart}
              onClick={this.handleClick}
            />
            <CardBody style={{ height: 250 }}>
              <CardTitle>{this.props.movieName}</CardTitle>
              <CardText>{this.props.movieDesc}</CardText>
            </CardBody>
          </Card>
        </div>
      </Col>
    );
  }
}

export default Movie;
