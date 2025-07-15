export default function Signup(){
    return(
        <>
        <div className="flex h-screen ">
         <div className="w-1/2 bg-theme-light-blue  flex justify-center items-center  h-screen">Logo </div>
        <div className="w-1/2 flex justify-center items-center flex-col">
        <h1 className="text-4xl font-bold text-theme-dark-blue">Sign up</h1>

        <form className="flex flex-col w-100  shadow rounded p-6 mt-3">
            <label>Name </label>
            <input type="text"  name="name" placeholder="Enter name" className="input-field"></input>
           
            <label>Email </label>
            <input type="email"  name="email" placeholder="Enter email" className="input-field"></input>
            <label> Phone number</label>
            <input type="tel"  name="phone" placeholder="Enter Phone number " className="input-field"></input>
            <label>Password </label>
            <input type="password"  name="password" placeholder="Enter password" className="input-field"></input>
           
            <label> Confirm Password </label>
            <input type="password"  name="confirm-Password" placeholder="Enter Confirm Password" className="input-field"></input>

            <button className="bg-theme-blue mt-4 p-2 rounded text-white ">Sign up </button>
            </form>
        </div>
</div>
        </>
    )
}