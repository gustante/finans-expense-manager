import React from 'react';

class Home extends React.Component {

    render(){
        
        return <>

            <section id="home" className=''>
                <div className="container ">
                    <div className="row py-5">
                    <div className="col-md-6 d-flex">
                        <div className="align-self-center">
                        <h1 className="display-4">Your finances made simple</h1>
                        <p>
                            Used by over 2 million people, Finans is an online tool that will make it easier for you to manage your finances.
                        </p>

                        <form className="mt-4 mb-4">
                            <div className="input-group input-group-lg">
                            <input type="text" placeholder="Your best email" className="form-control"/>
                            <div className="input-group-append">
                                <button type="button" className="btn btn-primary">Sign Up</button>
                            </div>
                            </div>
                        </form>

                        <p>Available on
                            <a href="" className="btn btn-outline-light mx-1">
                            <i className="fab fa-google-play"></i>
                            </a>
                            <a href="" className="btn btn-outline-light mx-1 ">
                            <i className="fab fa-app-store-ios"></i>
                            </a>
                        </p>

                        </div>
                    </div>
                    <div className="col-md-6 d-none d-md-block">
                        <img src="img/capa-mulher.png"/>
                    </div>
                    </div>
                </div>
                </section>

                <section className="caixa">
                    <div className="container">
                        <div className="row">
                        <div className="col-md-6 d-flex">
                            <div className="align-self-center">
                            <h2>Know where your money is going</h2>
                            <p>
                                With Finans, you can categorize each payment you make. Graphs and charts make it simple to visualize where your money is being spent on.
                            </p>
                            <a href="" className="btn btn-primary">Keep reading</a>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <img src="img/saiba.png" className="img-fluid"/>
                        </div>
                        </div>
                    </div>
                    </section>

                    <section className="caixa">
                    <div className="container">
                        <div className="row">
                        <div className="col-md-6">
                            <img src="img/juros.png" className="img-fluid"/>
                        </div>
                        <div className="col-md-6 d-flex">
                            <div className="align-self-center">
                            <h2>Stop paying interest and save</h2>
                            <p>
                                Keeping your bills up to date is a problem for you? Finans is here to help, we will alert you when a payment due date is approaching or if you are about to exceed your budget.
                            </p>
                            <a href="" className="btn btn-primary">Keep reading</a>
                            </div>
                        </div>
                        </div>
                    </div>
                    </section>

                    <section className="caixa">
                    <div className="container">
                        <div className="row">
                        <div className="col-md-4">
                            <img src="img/facil.png" className="img-fluid"/>
                            <h4>Easy to use</h4>
                            <p>
                            Finans goes above the basic and allows you to manage essencial details of your spendings. As simple as it can be!
                            </p>
                        </div>
                        <div className="col-md-4">
                            <img src="img/economize.png" className="img-fluid"/>
                            <h4>Save time</h4>
                            <p>
                            Time is money! In seconds, you can keep track of everything you need and spend your time with what really matters.
                            </p>
                        </div>
                        <div className="col-md-4">
                            <img src="img/suporte.png" className="img-fluid"/>
                            <h4>Friendly support</h4>
                            <p>
                            Questions? Concerns? Suggestions? Our support team is here to help making your life easier! Fill out our contact form or talk to an agent whenever you need to.
                            </p>
                        </div>
                        </div>
                    </div>
                    </section>
            
        </>; 
        
    }
}

export default Home;