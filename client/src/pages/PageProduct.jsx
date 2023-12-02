import React from 'react';
import { useParams } from 'react-router-dom';
import Image1 from '../images/front-view-sweet-chocolate-cake.jpg';

export default function PageProduct() {
  const { product } = useParams();
  return (
    <div className='pageproduct'>
      <figure className='pageproduct__image'>
        <img src={Image1} alt='tikvahs cake' />
      </figure>
      <div className='pageproduct__information'>
        <h1 className='pageproduct__name'>Blueberry cake</h1>
        <p className='pageproduct__price'>24.99</p>
        <p className='pageproduct__description'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates
          ab consequuntur iure totam. Repellat harum odio aliquam praesentium,
          modi et! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vel
          qui provident maxime nihil necessitatibus dolorem.
        </p>
        <button className='button button__anim--white pageproduct__button'>
          Add
        </button>
      </div>
    </div>
  );
}
