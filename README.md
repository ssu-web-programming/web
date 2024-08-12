# PO 서비스의 AI 기능들

PO 서비스에서 사용하는 AI 기능들 입니다 :)

## Serving

- `Staging` : https://vf-berlin.polarisoffice.com/
- `Production` : https://berlin.polarisoffice.com/

PO 서비스에서 사용하는 `인증 정보`가 필요합니다.

## 폴더 구조

`src`

- `components`
  프로젝트에서 사용하는 컴포넌트들의 집합
  그룹화가 가능한 컴포넌트들은 하위 폴더로 구분
  특정 기능에서 사용하는 컴포넌트들도 하위 폴더로 구분

- `api`
  API 요청을 위해 사용되는 wrapper
  모든 API 호출은 wrapper를 통해 호출되며 공통된 처리는 wrapper에서 처리

- `page`
  router 내부 페이지 집합

1. aiWrite
2. txt2img
3. AskDoc
4. alli
5. NOVA

- `views`
  비즈니스 로직을 포함하는 의미있는 컴포넌트 조합이긴 했었음...

- `locale`
  다국어 처리를 위한 초기화 함수
  다국어 리소스 스트링 집합

- `store`
  App 상태 관리를 위한 store
  slice로 상태를 분리하여 관리

- `util`
  공통 util 함수 (bridge init 포함)

## Available Scripts

### `yarn start`

개발을 위해 테스트 서버를 구동합니다. http://localhost:3000

### `check:i18n`

누락된 다국어 목록을 출력합니다.

**빌드와 관련된 스크립트는 배포 서버에서 사용하기 위함이니 되도록이면 사용하지 말 것**
