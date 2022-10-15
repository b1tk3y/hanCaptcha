# fmt: off
CHOSEONG_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
                 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
                 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
JUNGSEONG_LIST = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
                  'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
                  'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ']
JONGSEONG_LIST = [' ', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
                  'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
                  'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
                  'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

# fmt: on


class JamoSeparator:
    """
    입력한 한글 문자를 자소분리하고 그 결과를 리스트로 리턴한다.
    """

    START_CODEPOINT = 0xAC00  # 가
    END_CODEPOINT = 0xD7A3  # 힣

    def __init__(self, char):
        """
        :param char: Hangul Syllable
        """
        self.char = char

    def separate(self):
        """자소분리"""
        char_code = ord(self.char)
        if (
            JamoSeparator.END_CODEPOINT < char_code
            or char_code < JamoSeparator.START_CODEPOINT
        ):
            # 한글이 아니면
            raise Exception("invalid character")

        choseong = (char_code - JamoSeparator.START_CODEPOINT) // 21 // 28
        jungseong = (
            char_code - JamoSeparator.START_CODEPOINT - (choseong * 21 * 28)
        ) // 28
        jongseong = (
            char_code
            - JamoSeparator.START_CODEPOINT
            - (choseong * 21 * 28)
            - (jungseong * 28)
        )
        if jongseong == 0:
            return [
                CHOSEONG_LIST[choseong],
                JUNGSEONG_LIST[jungseong],
            ]

        return [
            CHOSEONG_LIST[choseong],
            JUNGSEONG_LIST[jungseong],
            JONGSEONG_LIST[jongseong],
        ]
