import React from 'react';
import { Link } from "react-router-dom";

function FAQ() {

    return (


        <div className="dashboard mb-5">

            <div class=" px-3 py-5 pt-md-5 pb-md-4 mx-auto text-center">
                <h1 class="display-4">Frequently Asked Questions</h1>
                <p class="lead">Quickly build an effective pricing table for your potential customers with this Bootstrap example. It’s built with default Bootstrap components and utilities with little customization.</p>
            </div>

            <div className="accordion" id="accordionExample">
                <div className="card bg-light">
                    <div className="card-header" id="headingOne">
                        <h2 className="mb-0">
                            <button className="btn btn-block text-left" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Question 1
                            </button>
                        </h2>
                    </div>

                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div className="card-body">
                            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.

                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingTwo">
                        <h2 className="mb-0">
                            <button className="btn text-dark btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                Question 2
                            </button>
                        </h2>
                    </div>
                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                        <div className="card-body">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingThree">
                        <h2 className="mb-0">
                            <button className="btn text-dark btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                Question 3
                            </button>
                        </h2>
                    </div>
                    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                        <div className="card-body">
                            Varius vel pharetra vel turpis nunc eget. Eget velit aliquet sagittis id consectetur purus ut faucibus. Nibh nisl condimentum id venenatis a condimentum vitae. Sit amet nulla facilisi morbi tempus iaculis urna id volutpat. Orci nulla pellentesque dignissim enim. Suscipit adipiscing bibendum est ultricies integer quis. Rhoncus urna neque viverra justo. Laoreet sit amet cursus sit amet dictum. Auctor eu augue ut lectus arcu bibendum at varius vel. Ultrices vitae auctor eu augue ut lectus arcu. Nunc consequat interdum varius sit. Suscipit tellus mauris a diam maecenas sed enim ut sem. Eu lobortis elementum nibh tellus molestie.
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-header" id="headingFour">
                        <h2 className="mb-0">
                            <button className="btn text-dark btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                                Question 4
                            </button>
                        </h2>
                    </div>
                    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordionExample">
                        <div className="card-body">


                            Viverra aliquet eget sit amet tellus cras adipiscing. Proin nibh nisl condimentum id venenatis a. Scelerisque in dictum non consectetur a erat. Vulputate odio ut enim blandit volutpat. Id aliquet risus feugiat in ante metus dictum. Sagittis aliquam malesuada bibendum arcu vitae elementum curabitur vitae nunc. Nec dui nunc mattis enim ut tellus elementum sagittis vitae. Potenti nullam ac tortor vitae purus faucibus ornare suspendisse. Fermentum et sollicitudin ac orci. Felis imperdiet proin fermentum leo vel.
                        </div>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-center my-5">

                    <Link to="/plans">
                        <button type="button" data-dismiss="modal" className="btn btn-warning">Start using Finans today!</button>
                    </Link>
                </div>
        </div>



    )
}
export default FAQ;

