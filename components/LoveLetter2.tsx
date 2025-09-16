
import React from 'react';
import HeartIcon from './icons/HeartIcon';

interface LoveLetter2Props {
  onNext: () => void;
}

const LoveLetter2: React.FC<LoveLetter2Props> = ({ onNext }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full animate-fade-in-up">
        <h2 className="text-2xl md:text-3xl font-bold text-rose-600 mb-4">
          Hehehe, ada lagi...
        </h2>
        <p className="text-sm md:text-base text-gray-700 leading-relaxed text-left">
            halo sayangkuu, selamat ulang tahun ya cayangkuuu, uluuuuu ulang tahun cik, aokwowkokw.
            <br/><br/>
            semoga kamu semakin jadi orang yang tidak suka marah marah meskipun aku membuat marah awokwokwokkw. maaf yaa ayy kalo aku sering buat kamu marah, soalnya ngakak cik lek kmu marah, oiya ay tunggu prank ku selanjutnya ahjahahahahah.
            <br/><br/>
            makasih ya sayangku kmu udah sayang aku hehehehe, aku ini sayang kamu kamu gausa tanya "kmu sayang aku ga ay" soalnya aku selalau sayang amu uluuuu, tapi emang kmu klo marah ngakak cik, semoga kamu jadi semakin sayang aowkowkokw, semoga kamu bisa pro main ML nya ya ay haha biar ga nub biar ga epic terus.
            <br/><br/>
            <span className="font-bold">INTINYA selamat ulang tahun sayangku cintaku, muaachhhhh.</span>
        </p>
        <div className="flex justify-end mt-4">
            <HeartIcon className="w-8 h-8 text-red-400" />
        </div>
      </div>
      
      <button
        onClick={onNext}
        className="mt-12 px-8 py-3 bg-rose-500 text-white font-bold rounded-full shadow-lg hover:bg-rose-600 transform hover:scale-105 transition-all duration-300 animate-pulse"
      >
        Lanjut ke Kue Ulang Tahun!
      </button>
    </div>
  );
};

export default LoveLetter2;
