import Loader from "react-loader-spinner";

export default function SpinnerLoader() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8rem'}}>
          <Loader
            type="TailSpin"
            color="#00BFFF"
            height={100}
            width={100}
        />  
        </div>        
    );
}
