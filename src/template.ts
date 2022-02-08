const testHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
  body {
    background-color: white;
    border: 1px solid black;
    height: 96.5vh;
  }
  </style>
</head>

<Body>
  <p>
    <!-- It is a Paragraph tag for creating the paragraph -->
    <b> HTML </b> standss for <i> <u> Hyper Text Markup Language. </u> </i> It is used to create a web pages and
    applications. This language
    is easily understandable by the user and also be modifiable. It is actually a Markup language, hence it provides a
    flexible way for designing the
    web pages along with the text.
  </p>
  HTML file is made up of different elements. <b> An element </b> is a collection of <i> start tag, end tag, attributes
    and the text between them</i>.
  </p>
</Body>

</html>
`


const templateKwitansi = `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>


 
  body {
    /*   border: 1px solid black; */
      background-color: white;
      font-size: 20px;
    /*   min-height: 96.5vh; */
    
    }
    .border {
      border: 1px solid black;
    /*   height: 100% !important; */
      margin:10px;
      padding-left: 70px;
      padding-right: 70px;
      padding-top: 30px;
      padding-bottom:30px;
    /*     background:red; */
      position:absolute;
      top:0px;
      right:0px;
      bottom:0px;
      left:0px;
    }

    .flex {
      display: flex
    }
    .flex-col {
      flex-direction: column;
    }
    .w-full {
      width: 100%
    }
    .px {
      margin-left:20px;
      margin-right:20px;
    }
    .float-right {
      float:right;
    }
    
    .text-right {
      text-align:right;
    }
.h-full {
  height:100%;
}
.self-end {
  align-self:flex-end;
}
    .flex-d {
      display: flex;
      justify-content:flex-end;
      padding-bottom:30px;
    }
.red {
  background-color:red;
}
    
  </style>
</head>

<Body>
  <div class="border">
  <div class="flex flex-col w-full h-full">
      <div class="flex" style="align-items:center;margin-bottom:20px;">
        <img src="logo.jpeg" height="100"/>
        <label style="margin-left:20px;font-size:25px !important">Mts Tarbiyatul Falah</label>
      </div>
      <div class="">
        <div class="flex w-full">
          <div class="flex flex-col">
            <label>Nama</label>
            <label>Kelas</label>
          </div>
          <div class="flex w-full flex-col">
            <label>: Yusuf </label>
            <label>: 7-1</label>
          </div>
          <div class="flex flex-col">
            <label>Semester</label>
            <label>Tahun Ajaran</label>
          </div>
          <div class="flex w-full flex-col">
            <label>: 2</label>
            <label>: 2020/2021</label>
          </div>
        </div>
        <hr>
        <div class="flex w-full">
          <div class="flex w-full flex-col px">
            <label>SPP Januari</label>
            <label>SPP Februari</label>
            <label>SPP Maret</label>
          </div>
          <div class="flex w-full flex-col float-right text-right px">
            <label>Rp 200.000</label>
            <label>Rp 200.000</label>
            <label>Rp 200.000</label>
          </div>
        </div>
        <hr>
        <div class="flex w-full">
          <label class="w-full">Total</label>
          <label class="float-right text-right w-full"> Rp 600.000</label>
        </div>
      </div>
      <div class="float-right w-full text-right flex-d h-full">
        <label class="self-end">Tanda Tangan</label>
      </div>
    </div

  </div>
</Body>

</html>
`

export { testHtml, templateKwitansi }