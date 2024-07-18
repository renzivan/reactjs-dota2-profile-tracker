interface TalentTreeProps {
  slot: number,
  className: string
}

export default function TalentTree({ slot, className }: TalentTreeProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
      <svg viewBox="0 0 51 63" height="23" y="4.45" style={{ width: '100%', height: '100%' }}>
        {/* <!-- color definition for talents --> */}
        <linearGradient id=":r84:l_1" gradientUnits="userSpaceOnUse" x1="-43.2212" y1="40.4932" x2="-20.5475" y2="63.1668" gradientTransform="matrix(1 0 0 1 47.457 0)">
          <stop offset="0.1257" style={{ stopColor: 'rgb(231, 189, 118)' }}></stop>
          <stop offset="0.1298" style={{ stopColor: 'rgb(230, 187, 116)' }}></stop>
          <stop offset="0.2466" style={{ stopColor: 'rgb(212, 142, 78)' }}></stop>
          <stop offset="0.3335" style={{ stopColor: 'rgb(204, 117, 59)' }}></stop>
          <stop offset="0.3803" style={{ stopColor: 'rgb(201, 108, 53)' }}></stop>
          <stop offset="0.8908" style={{ stopColor: 'rgb(201, 109, 52)' }}></stop>
          <stop offset="0.9078" style={{ stopColor: 'rgb(204, 116, 57)' }}></stop>
          <stop offset="0.9366" style={{ stopColor: 'rgb(210, 134, 71)' }}></stop>
          <stop offset="0.9734" style={{ stopColor: 'rgb(222, 167, 99)' }}></stop>
          <stop offset="0.9891" style={{ stopColor: 'rgb(229, 185, 114)' }}></stop>
        </linearGradient>
        <linearGradient id=":r84:r_2" gradientUnits="userSpaceOnUse" x1="-21.8032" y1="28.7007" x2="8.0713" y2="58.5753" gradientTransform="matrix(-1 0 0 1 27.5703 0)">
          <stop offset="0.0938" style={{ stopColor: 'rgb(231, 189, 118)' }}></stop>
          <stop offset="0.3301" style={{ stopColor: 'rgb(201, 108, 53)' }}></stop>
          <stop offset="0.5241" style={{ stopColor: 'rgb(201, 110, 54)' }}></stop>
          <stop offset="0.6135" style={{ stopColor: 'rgb(203, 115, 57)' }}></stop>
          <stop offset="0.6814" style={{ stopColor: 'rgb(206, 124, 64)' }}></stop>
          <stop offset="0.7385" style={{ stopColor: 'rgb(210, 136, 74)' }}></stop>
          <stop offset="0.7888" style={{ stopColor: 'rgb(217, 154, 89)' }}></stop>
          <stop offset="0.8337" style={{ stopColor: 'rgb(226, 178, 108)' }}></stop>
          <stop offset="0.844" style={{ stopColor: 'rgb(229, 185, 114)' }}></stop>
          <stop offset="1" style={{ stopColor: 'rgb(242, 214, 139)' }}></stop>
        </linearGradient>
        <linearGradient id=":r84:l_2" gradientUnits="userSpaceOnUse" x1="1.6265" y1="28.7007" x2="31.5003" y2="58.5746">
          <stop offset="0.0938" style={{ stopColor: 'rgb(231, 189, 118)' }}></stop>
          <stop offset="0.3301" style={{ stopColor: 'rgb(201, 108, 53)' }}></stop>
          <stop offset="0.5241" style={{ stopColor: 'rgb(201, 110, 54)' }}></stop>
          <stop offset="0.6135" style={{ stopColor: 'rgb(203, 115, 57)' }}></stop>
          <stop offset="0.6814" style={{ stopColor: 'rgb(206, 124, 64)' }}></stop>
          <stop offset="0.7385" style={{ stopColor: 'rgb(210, 136, 74)' }}></stop>
          <stop offset="0.7888" style={{ stopColor: 'rgb(217, 154, 89)' }}></stop>
          <stop offset="0.8337" style={{ stopColor: 'rgb(226, 178, 108)' }}></stop>
          <stop offset="0.844" style={{ stopColor: 'rgb(229, 185, 114)' }}></stop>
          <stop offset="1" style={{ stopColor: 'rgb(242, 214, 139)' }}></stop>
        </linearGradient>
        <linearGradient id=":r84:r_3" gradientUnits="userSpaceOnUse" x1="-12.814" y1="14.5498" x2="13.2803" y2="59.7464" gradientTransform="matrix(-1 0 0 1 31.5703 0)">
          <stop offset="0.0938" style={{ stopColor: 'rgb(231, 189, 118)' }}></stop>
          <stop offset="0.2261" style={{ stopColor: 'rgb(201, 108, 53)' }}></stop>
          <stop offset="0.3757" style={{ stopColor: 'rgb(201, 110, 54)' }}></stop>
          <stop offset="0.4915" style={{ stopColor: 'rgb(204, 117, 59)' }}></stop>
          <stop offset="0.5961" style={{ stopColor: 'rgb(208, 129, 67)' }}></stop>
          <stop offset="0.694" style={{ stopColor: 'rgb(213, 145, 81)' }}></stop>
          <stop offset="0.7864" style={{ stopColor: 'rgb(222, 169, 101)' }}></stop>
          <stop offset="0.8335" style={{ stopColor: 'rgb(229, 185, 114)' }}></stop>
          <stop offset="1" style={{ stopColor: 'rgb(242, 214, 139)' }}></stop>
        </linearGradient>
        <linearGradient id=":r84:l_3" gradientUnits="userSpaceOnUse" x1="6.6157" y1="14.5508" x2="32.7095" y2="59.7465">
          <stop offset="0.0938" style={{ stopColor: 'rgb(231, 189, 118)' }}></stop>
          <stop offset="0.2261" style={{ stopColor: 'rgb(201, 108, 53)' }}></stop>
          <stop offset="0.3757" style={{ stopColor: 'rgb(201, 110, 54)' }}></stop>
          <stop offset="0.4915" style={{ stopColor: 'rgb(204, 117, 59)' }}></stop>
          <stop offset="0.5961" style={{ stopColor: 'rgb(208, 129, 67)' }}></stop>
          <stop offset="0.694" style={{ stopColor: 'rgb(213, 145, 81)' }}></stop>
          <stop offset="0.7864" style={{ stopColor: 'rgb(222, 169, 101)' }}></stop>
          <stop offset="0.8335" style={{ stopColor: 'rgb(229, 185, 114)' }}></stop>
          <stop offset="1" style={{ stopColor: 'rgb(242, 214, 139)' }}></stop>
        </linearGradient>
        <linearGradient id=":r84:r_4" gradientUnits="userSpaceOnUse" x1="-7.8799" y1="3.667" x2="23.3677" y2="57.7894" gradientTransform="matrix(-1 0 0 1 38.4375 0)">
          <stop offset="0.0938" style={{ stopColor: 'rgb(231, 189, 118)' }}></stop>
          <stop offset="0.2261" style={{ stopColor: 'rgb(201, 108, 53)' }}></stop>
          <stop offset="0.3141" style={{ stopColor: 'rgb(202, 113, 56)' }}></stop>
          <stop offset="0.4401" style={{ stopColor: 'rgb(207, 126, 65)' }}></stop>
          <stop offset="0.5891" style={{ stopColor: 'rgb(215, 148, 84)' }}></stop>
          <stop offset="0.7544" style={{ stopColor: 'rgb(228, 183, 113)' }}></stop>
          <stop offset="0.7585" style={{ stopColor: 'rgb(229, 185, 114)' }}></stop>
          <stop offset="1" style={{ stopColor: 'rgb(242, 214, 139)' }}></stop>
        </linearGradient>
        <linearGradient id=":r84:r_1" gradientUnits="userSpaceOnUse" x1="-19.9316" y1="40.4932" x2="2.7414" y2="63.1662" gradientTransform="matrix(-1 0 0 1 26.8457 0)">
          <stop offset="0.1257" style={{ stopColor: 'rgb(231, 189, 118)' }}></stop>
          <stop offset="0.1298" style={{ stopColor: 'rgb(230, 187, 116)' }}></stop>
          <stop offset="0.2466" style={{ stopColor: 'rgb(212, 142, 78)' }}></stop>
          <stop offset="0.3335" style={{ stopColor: 'rgb(204, 117, 59)' }}></stop>
          <stop offset="0.3803" style={{ stopColor: 'rgb(201, 108, 53)' }}></stop>
          <stop offset="0.8908" style={{ stopColor: 'rgb(201, 109, 52)' }}></stop>
          <stop offset="0.9078" style={{ stopColor: 'rgb(204, 116, 57)' }}></stop>
          <stop offset="0.9366" style={{ stopColor: 'rgb(210, 134, 71)' }}></stop>
          <stop offset="0.9734" style={{ stopColor: 'rgb(222, 167, 99)' }}></stop>
          <stop offset="0.9891" style={{ stopColor: 'rgb(229, 185, 114)' }}></stop>
        </linearGradient>

        {/* <!-- inactive 10_1 --> */}
        <path fill="hsl(0,0%,28%)" d="M0.013,44.716c0,0,6.586,6.584,9.823,6.805c3.236,0.224,7.033,0,7.033,0s7.024,1.732,7.024,7.368V63 l3.195-0.014c0,0,0-3.782,0-5.571c0-6.857-10.053-7.567-10.053-7.567S11.957,41.979,0.013,44.716z"></path>
        {/* <!-- inactive 10_2 --> */}
        <path fill="hsl(0,0%,28%)" d="M51,44.716c0,0-6.586,6.584-9.823,6.805c-3.235,0.224-7.032,0-7.032,0s-7.024,1.732-7.024,7.368V63 l-3.195-0.014c0,0,0-3.782,0-5.571c0-6.857,10.052-7.567,10.052-7.567S39.057,41.979,51,44.716z"></path>
        {/* <!-- inactive 15_1 --> */}
        <path fill="hsl(0,0%,28%)" d="M0,30.326c0,0,5.744,9.07,9.516,9.495c3.1,0.348,6.542,0.107,8.122,0.262 c3.068,0.301,6.256,1.351,6.256,5.667V63h3.181c0,0,0-17.488,0-18.454c0-0.964-0.006-5.235-7.093-6.584 c-1.207-0.232-3.687-0.281-4.913-0.281C15.068,37.681,10.547,29.951,0,30.326z"></path>
        {/* <!-- inactive 15_2 --> */}
        <path fill="hsl(0,0%,28%)" d="M51,30.326c0,0-5.745,9.07-9.517,9.495c-3.1,0.348-6.542,0.107-8.12,0.262 c-3.069,0.301-6.257,1.351-6.257,5.667V63h-3.182c0,0,0-17.488,0-18.454c0-0.964,0.006-5.235,7.093-6.584 c1.208-0.232,3.688-0.281,4.913-0.281C35.931,37.681,40.451,29.951,51,30.326z"></path>
        {/* <!-- inactive 20_1 --> */}
        <path fill="hsl(0,0%,28%)" d="M4.031,16.042c0,0,0.669,3.435,2.899,6.315c2.232,2.878,4.147,4.891,6.489,4.891 c2.344,0,6.208-0.01,7.68,0.868c1.837,1.095,2.803,3.213,2.803,5.373c0,0.976,0,29.511,0,29.511h3.173V33.489 c0,0-0.085-3.859-3.102-6.426c-1.651-1.405-2.911-2.141-5.294-2.141c-0.908,0-2.041-0.019-2.041-0.019s-1.785-4.153-5.188-6.203 C8.046,16.651,4.031,16.042,4.031,16.042z"></path>
        {/* <!-- inactive 20_2 --> */}
        <path fill="hsl(0,0%,28%)" d="M46.969,16.042c0,0-0.669,3.435-2.898,6.315c-2.232,2.878-4.147,4.891-6.489,4.891 c-2.344,0-6.208-0.01-7.68,0.868c-1.837,1.095-2.803,3.213-2.803,5.373c0,0.976,0,29.511,0,29.511h-3.174V33.489 c0,0,0.086-3.859,3.103-6.426c1.651-1.405,2.911-2.141,5.295-2.141c0.907,0,2.041-0.019,2.041-0.019s1.785-4.153,5.187-6.203 C42.954,16.651,46.969,16.042,46.969,16.042z"></path>
        {/* <!-- inactive 25_1 --> */}
        <path fill="hsl(0,0%,28%)" d="M11.033,0c0,0-0.802,7.891,2.625,11.654c3.426,3.761,5.55,2.683,7.765,3.097 c1.969,0.369,2.479,1.772,2.479,3.984c0,2.212,0,44.209,0,44.209h3.101c0,0,0.072-43.305,0.072-44.209 c0-0.905-0.019-4.906-3.792-6.115c-1.592-0.509-2.334-0.376-2.918-2.293C19.782,8.408,17.96,1.99,11.033,0z"></path>
        {/* <!-- inactive 25_2 --> */}
        <path fill="hsl(0,0%,28%)" d="M39.967,0c0,0,0.803,7.891-2.625,11.654c-3.426,3.761-5.551,2.683-7.765,3.097 c-1.969,0.369-2.479,1.772-2.479,3.984c0,2.212,0,44.209,0,44.209h-3.101c0,0-0.073-43.305-0.073-44.209 c0-0.905,0.02-4.906,3.793-6.115c1.592-0.509,2.335-0.376,2.917-2.293C31.218,8.408,33.04,1.99,39.967,0z"></path>

        { slot === 0 && <path fill="url(#:r84:r_1)" d="M51,44.716c0,0-6.586,6.584-9.823,6.805c-3.235,0.224-7.032,0-7.032,0s-7.024,1.732-7.024,7.368V63 l-3.195-0.014c0,0,0-3.782,0-5.571c0-6.857,10.052-7.567,10.052-7.567S39.057,41.979,51,44.716z"></path>}
        { slot === 1 && <path fill="url(#:r84:l_1)" d="M0.013,44.716c0,0,6.586,6.584,9.823,6.805c3.236,0.224,7.033,0,7.033,0s7.024,1.732,7.024,7.368V63 l3.195-0.014c0,0,0-3.782,0-5.571c0-6.857-10.053-7.567-10.053-7.567S11.957,41.979,0.013,44.716z"></path>}
        { slot === 2 && <path fill="url(#:r84:r_1)" d="M51,30.326c0,0-5.745,9.07-9.517,9.495c-3.1,0.348-6.542,0.107-8.12,0.262 c-3.069,0.301-6.257,1.351-6.257,5.667V63h-3.182c0,0,0-17.488,0-18.454c0-0.964,0.006-5.235,7.093-6.584 c1.208-0.232,3.688-0.281,4.913-0.281C35.931,37.681,40.451,29.951,51,30.326z"></path> }
        { slot === 3 && <path fill="url(#:r84:l_1)" d="M0,30.326c0,0,5.744,9.07,9.516,9.495c3.1,0.348,6.542,0.107,8.122,0.262 c3.068,0.301,6.256,1.351,6.256,5.667V63h3.181c0,0,0-17.488,0-18.454c0-0.964-0.006-5.235-7.093-6.584 c-1.207-0.232-3.687-0.281-4.913-0.281C15.068,37.681,10.547,29.951,0,30.326z"></path>}
        { slot === 4 && <path fill="url(#:r84:r_1)" d="M46.969,16.042c0,0-0.669,3.435-2.898,6.315c-2.232,2.878-4.147,4.891-6.489,4.891 c-2.344,0-6.208-0.01-7.68,0.868c-1.837,1.095-2.803,3.213-2.803,5.373c0,0.976,0,29.511,0,29.511h-3.174V33.489 c0,0,0.086-3.859,3.103-6.426c1.651-1.405,2.911-2.141,5.295-2.141c0.907,0,2.041-0.019,2.041-0.019s1.785-4.153,5.187-6.203 C42.954,16.651,46.969,16.042,46.969,16.042z"></path>}
        { slot === 5 && <path fill="url(#:r84:l_1)" d="M4.031,16.042c0,0,0.669,3.435,2.899,6.315c2.232,2.878,4.147,4.891,6.489,4.891 c2.344,0,6.208-0.01,7.68,0.868c1.837,1.095,2.803,3.213,2.803,5.373c0,0.976,0,29.511,0,29.511h3.173V33.489 c0,0-0.085-3.859-3.102-6.426c-1.651-1.405-2.911-2.141-5.294-2.141c-0.908,0-2.041-0.019-2.041-0.019s-1.785-4.153-5.188-6.203 C8.046,16.651,4.031,16.042,4.031,16.042z"></path>}
        { slot === 6 && <path fill="url(#:r84:r_1)" d="M39.967,0c0,0,0.803,7.891-2.625,11.654c-3.426,3.761-5.551,2.683-7.765,3.097 c-1.969,0.369-2.479,1.772-2.479,3.984c0,2.212,0,44.209,0,44.209h-3.101c0,0-0.073-43.305-0.073-44.209 c0-0.905,0.02-4.906,3.793-6.115c1.592-0.509,2.335-0.376,2.917-2.293C31.218,8.408,33.04,1.99,39.967,0z"></path>}
        { slot === 7 && <path fill="url(#:r84:l_1)" d="M11.033,0c0,0-0.802,7.891,2.625,11.654c3.426,3.761,5.55,2.683,7.765,3.097 c1.969,0.369,2.479,1.772,2.479,3.984c0,2.212,0,44.209,0,44.209h3.101c0,0,0.072-43.305,0.072-44.209 c0-0.905-0.019-4.906-3.792-6.115c-1.592-0.509-2.334-0.376-2.918-2.293C19.782,8.408,17.96,1.99,11.033,0z"></path>}
      </svg>

      {/* <!-- color definition for bonus stats --> */}
      <linearGradient id="copper.mainGradient" x1="0" x2="25.4482" y1="0.5" y2="2.14888" gradientUnits="userSpaceOnUse">
        <stop stopColor="hsl(18,65%,48%)" offset="0"></stop>
        <stop stopColor="hsl(25,73%,65%)" offset="0.5"></stop>
        <stop stopColor="hsl(22,58%,49%)" offset="1"></stop>
      </linearGradient>

      {/* <!-- inactive bonus stats --> */}
      <path d="M3.258 23.38c.295-.22.624-.303.992-.238.362.057.651.235.868.536.217.3.298.634.243 1.002-.05.376-.225.67-.52.891a1.24 1.24 0 01-1.002.244 1.275 1.275 0 01-.868-.535 1.315 1.315 0 01-.242-1.002c.05-.377.225-.671.529-.898z" fill="var(--talent-inactive)"></path>
      <path d="M6.244 26.987c.215-.301.503-.482.873-.534.361-.06.69.02.988.24.297.218.474.51.532.878.067.374-.012.708-.227 1.01-.221.31-.51.491-.88.544a1.263 1.263 0 01-.987-.24 1.302 1.302 0 01-.533-.879 1.291 1.291 0 01.234-1.019z" fill="var(--talent-inactive)"></path>
      <path d="M10.17 29.492c.114-.355.333-.617.669-.783a1.26 1.26 0 011.012-.082c.349.115.607.338.773.669.177.335.204.677.091 1.032a1.27 1.27 0 01-.671.793 1.26 1.26 0 01-1.012.082 1.284 1.284 0 01-.774-.669 1.294 1.294 0 01-.087-1.042z" fill="var(--talent-inactive)"></path>
      <path d="M14.684 30.638c0-.373.129-.69.398-.954.258-.264.57-.396.938-.396.366 0 .68.13.938.393.27.262.4.58.4.953.002.383-.127.701-.397.965a1.268 1.268 0 01-.937.396c-.367 0-.68-.13-.939-.393-.27-.263-.4-.58-.4-.964z" fill="var(--talent-inactive)"></path>
      <path d="M19.302 30.322a1.287 1.287 0 01.09-1.032c.165-.331.423-.555.771-.67a1.26 1.26 0 011.013.08c.336.166.556.428.67.782.116.365.09.708-.087 1.043a1.284 1.284 0 01-.772.67 1.26 1.26 0 01-1.013-.08 1.27 1.27 0 01-.672-.793z" fill="var(--talent-inactive)"></path>
      <path d="M23.614 28.564a1.284 1.284 0 01-.23-1.01c.058-.367.234-.66.53-.88.297-.219.626-.3.988-.241.37.051.659.231.874.532.223.31.302.645.236 1.019-.057.367-.234.66-.53.88-.297.219-.626.3-.988.241a1.252 1.252 0 01-.88-.541z" fill="var(--talent-inactive)"></path>
      <path d="M27.184 25.537a1.272 1.272 0 01-.523-.89 1.316 1.316 0 01.24-1.002c.215-.302.504-.48.866-.538.368-.067.697.015.993.234.305.226.481.52.531.896.057.368-.023.702-.239 1.003-.216.301-.505.48-.866.538a1.24 1.24 0 01-1.002-.241z" fill="var(--talent-inactive)"></path>

      {/* <!-- outline nga circle --> */}
      <path fill="var(--talent-inactive)" fillRule="evenodd" clipRule="evenodd" d="M1.974 21.886a15.733 15.733 0 01-1.307-6.302C.667 6.983 7.537 0 16 0c8.463 0 15.333 6.983 15.333 15.584 0 2.226-.46 4.343-1.288 6.259a3.35 3.35 0 00-.942-.549 14.626 14.626 0 001.152-5.71c0-7.996-6.387-14.488-14.255-14.488-7.867 0-14.255 6.492-14.255 14.488 0 2.042.417 3.986 1.169 5.75a3.36 3.36 0 00-.94.552z"></path>
    </svg>
  )
}
